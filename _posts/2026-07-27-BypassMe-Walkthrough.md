---
layout: post
title: "Bypass Me Reverse Engineering Walkthrough"
date: 2026-07-27
categories: [ctf, picoctf, walkthrough, reverse engineering]
image: https://miro.medium.com/v2/resize:fit:2000/format:webp/1*Dh_mo81Nv4r9mlptf8SoYA.png
permalink: /blog/BypassMeWalkthrough
locked: false
---

> picoCTF 2026 · Reverse Engineering · Medium  
> Educational walkthrough documenting the analysis process used on `bypassme.bin`.

## Objective

The challenge provides a password-protected Linux binary that performs input sanitization. The goal is to reverse engineer or debug the program rather than guess the password.

This walkthrough documents how we:

- Identified the binary format and protections.
- Mapped important functions using symbols.
- Traced the authentication logic in LLDB.
- Determined how sanitization works.
- Recovered the decoded comparison value.
- Understood the success and failure branches.
- Bypassed authentication by modifying CPU state in LLDB.
- Explained why the flag was unavailable in the local environment.

---

## 1. Initial Binary Identification

We inspected the binary with:

```bash
file bypassme.bin
```

Result:

```text
ELF 64-bit LSB pie executable, x86-64, dynamically linked,
interpreter /lib64/ld-linux-x86-64.so.2,
with debug_info, not stripped
```

### What this tells us

| Property | Meaning |
|---|---|
| ELF | Standard executable format used on Linux |
| 64-bit x86-64 | Runs on modern Intel/AMD Linux systems |
| PIE | Runtime addresses can change because of ASLR |
| Dynamically linked | Uses shared libraries such as glibc |
| Debug information | Source filenames, line numbers, and symbols may be available |
| Not stripped | Function names remain inside the binary |

The debug information and symbols made this challenge much easier to study.

---

## 2. Observing Runtime Behavior

We ran:

```bash
./bypassme.bin
```

A patterned input was useful because it made transformations obvious:

```text
AAAABBBBCCCC1234
```

The program displayed:

```text
Raw Input:      [AAAABBBBCCCC1234]
Sanitized Input:[AAAABBBBCCCC]
```

Further tests showed that digits were removed from the displayed sanitized value while letters remained in their original order.

At this stage, we knew sanitization occurred, but we did **not** yet know whether the sanitized or raw value was used for authentication.

---

## 3. Finding Important Symbols

We listed likely authentication-related functions:

```bash
nm -C bypassme.bin | grep -Ei 'main|sanitize|auth|pass|check'
```

Relevant results:

```text
auth_sequence()
decode_password(char*)
sanitize(char const*, char*)
main
```

This gave us an initial program map:

```text
main
├── decode_password
├── sanitize
├── password comparison
└── auth_sequence
```

---

## 4. Loading the Binary in LLDB

We started LLDB:

```bash
lldb ./bypassme.bin
```

Initially, we placed a breakpoint on:

```lldb
breakpoint set --name auth_sequence
```

However, the breakpoint was never reached when incorrect passwords were entered.

Checking it with:

```lldb
breakpoint list
```

showed:

```text
resolved = 1
hit count = 0
```

This taught us an important lesson:

> A function name that sounds security-related is not necessarily the function that performs authentication.

---

## 5. Mapping `main()`

We disassembled `main()`:

```lldb
disassemble --name main
```

The important section was:

```asm
callq  strcmp
testl  %eax, %eax
jne    failure_path
callq  auth_sequence
```

This showed that:

1. A comparison function runs first.
2. The result is tested.
3. Nonzero results go to failure.
4. Zero results continue to `auth_sequence()`.

Therefore, `auth_sequence()` is part of the success path, not the password check itself.

---

## 6. Identifying the Comparison Function

The call target initially appeared only as a PLT address:

```asm
callq  0x555555555180
```

Because the binary is dynamically linked, imported functions are called through the Procedure Linkage Table and Global Offset Table.

We resolved the relevant relocation using:

```bash
objdump -R bypassme.bin | grep -i 3fa8
```

Result:

```text
R_X86_64_JUMP_SLOT  strcmp@GLIBC_2.2.5
```

This confirmed that the program uses:

```c
strcmp(first_string, second_string);
```

---

## 7. Inspecting `strcmp()` Arguments

We placed a breakpoint on `strcmp()`:

```lldb
breakpoint set --name strcmp
```

In a fresh LLDB session, this breakpoint may initially be pending because libc has not loaded yet:

```text
Breakpoint: no locations (pending)
```

Once the program starts, LLDB resolves it automatically.

We entered a recognizable test value:

```text
TEST1234
```

At the breakpoint, the first two function arguments were in:

```text
RDI = first string
RSI = second string
```

We inspected the first argument:

```lldb
x/s $rdi
```

Result:

```text
"TEST1234"
```

This proved that the first comparison argument was the **raw input**, including digits.

We inspected the second argument:

```lldb
x/s $rsi
```

Result:

```text
"SuperSecure"
```

This was the decoded expected password.

### Critical finding

The program displayed a sanitized version, but authenticated using the raw value:

```c
sanitize(raw_input, sanitized_input);
printf("Sanitized Input: %s", sanitized_input);

strcmp(raw_input, decoded_password);
```

The sanitizer did not protect or transform the value used by `strcmp()`.

---

## 8. Understanding `decode_password()`

We disassembled:

```lldb
disassemble --name decode_password
```

The important loop included:

```asm
movzbl encoded_byte, %eax
xorl   $-0x56, %eax
movb   %dl, destination
```

The low byte of `-0x56` is `0xAA`, so the decoding operation was effectively:

```c
decoded[i] = encoded[i] ^ 0xAA;
```

The function:

1. Stores 11 encoded bytes.
2. Iterates over indexes `0` through `10`.
3. XORs each byte with `0xAA`.
4. Writes the result into the destination buffer.
5. Appends a null terminator.

Conceptual pseudocode:

```c
void decode_password(char *output) {
    unsigned char encoded[11] = { /* encoded bytes */ };

    for (int i = 0; i < 11; i++) {
        output[i] = encoded[i] ^ 0xAA;
    }

    output[11] = '\0';
}
```

This explains how the readable password appeared in memory before `strcmp()`.

---

## 9. Understanding `sanitize()`

We disassembled:

```lldb
disassemble --name sanitize
```

The sanitizer called a PLT entry at `0x11a0`.

We identified it with:

```bash
objdump -d bypassme.bin | grep -A3 '00000000000011a0'
```

Result:

```text
isalpha@plt
```

Therefore, the sanitizer behaves like:

```c
void sanitize(const char *input, char *output) {
    int input_index = 0;
    int output_index = 0;

    while (input[input_index] != '\0') {
        if (isalpha(input[input_index])) {
            output[output_index++] = input[input_index];
        }

        input_index++;
    }

    output[output_index] = '\0';
}
```

### Sanitizer behavior

It keeps alphabetic characters and removes:

- Digits
- Spaces
- Punctuation
- Other non-alphabetic bytes

However, the resulting buffer is printed only. It is not used by the actual password comparison.

---

## 10. Understanding `strcmp()` Return Values

After stopping inside `strcmp()`, we used:

```lldb
finish
```

This executes the current function and stops immediately after it returns to the caller.

The result is returned in `EAX`:

```lldb
register read eax
```

For the input `TEST1234`, the result was:

```text
eax = 0x00000001
```

For `strcmp()`:

```text
0       = strings are equal
nonzero = strings differ
```

With the input `test12345.`, the result was:

```text
eax = 0x00000021
```

The first mismatch was:

```text
't' = 0x74
'S' = 0x53

0x74 - 0x53 = 0x21
```

This also demonstrated that the comparison is case-sensitive.

---

## 11. Understanding the Authentication Branch

Immediately after `strcmp()`, the program executes:

```asm
testl %eax, %eax
jne   failure_path
```

### `testl %eax, %eax`

This performs a bitwise test without changing `EAX`. Its purpose here is to update CPU flags based on whether `EAX` is zero.

### Zero Flag behavior

```text
EAX = 0       → ZF = 1
EAX != 0      → ZF = 0
```

### `jne`

`jne` means “jump if not equal,” which in this context means jump when the Zero Flag is clear:

```text
ZF = 0 → jump to failure
ZF = 1 → continue to success
```

With the real failed comparison result:

```text
EAX = 1
ZF  = 0
```

Execution jumped to the failure branch.

---

## 12. Debugger-Based Authentication Bypass

While paused immediately after `strcmp()` returned, we changed the return value:

```lldb
register write eax 0
```

We verified it:

```lldb
register read eax
```

Result:

```text
eax = 0x00000000
```

We then stepped over the `test` instruction:

```lldb
nexti
```

The CPU flags were inspected with:

```lldb
register read rflags
```

Before modifying `EAX`, the flags were:

```text
rflags = 0x202
ZF = 0
```

After setting `EAX` to zero and executing `test`, they were:

```text
rflags = 0x246
ZF = 1
```

Stepping over `jne`:

```lldb
nexti
```

landed at the success path instead of the failure path.

### Bypass flow

```text
Real strcmp result: nonzero
            ↓
LLDB changes EAX to 0
            ↓
test eax, eax sets ZF = 1
            ↓
jne failure is not taken
            ↓
Program enters success path
```

This modification affected only the current process. It did not patch the binary on disk.

---

## 13. Understanding `auth_sequence()`

We disassembled its exact address range:

```bash
objdump -d -C \
  --start-address=0x1457 \
  --stop-address=0x14c6 \
  bypassme.bin
```

It:

1. Prints an authentication message.
2. Flushes standard output.
3. Loops three times.
4. Sleeps for one second.
5. Prints a period each time.
6. Prints a newline.
7. Returns.

It is only a success animation.

---

## 14. Finding the Flag File Path

After `auth_sequence()`, `main()` calls `fopen()`.

We identified the PLT entry:

```bash
objdump -d bypassme.bin | grep -A3 '00000000000011b0'
```

Result:

```text
fopen@plt
```

We inspected nearby read-only data:

```bash
objdump -s \
  --start-address=0x2818 \
  --stop-address=0x2834 \
  bypassme.bin
```

The strings were:

```text
Mode:     "r"
Filename: "../../root/flag.txt"
```

Therefore, the success path effectively performs:

```c
FILE *file = fopen("../../root/flag.txt", "r");
```

---

## 15. Why the Local Bypass Did Not Produce the Flag

After forcing the success branch locally, the program printed:

```text
Authenticating...
Flag file not found.
```

This is expected.

The downloaded binary was present locally, but the server-side file:

```text
../../root/flag.txt
```

was not.

The flag is not embedded in the binary. It exists only in the picoCTF challenge environment.

This is an important distinction:

```text
Binary analysis can reveal program logic.
It cannot read a server-side file that was never downloaded.
```

---

## 16. Running the Remote Challenge

The remote instance was accessed using SSH:

```bash
ssh -p <PORT> ctf-player@foggy-cliff.picoctf.net
```

After connecting, the binary was launched with:

```bash
./bypassme.bin
```

The recovered password was entered exactly as observed in memory:

```text
SuperSecure
```

Capitalization matters because `strcmp()` is case-sensitive.

Challenge ports are often temporary and may change when an instance is restarted.

---

## 17. Full Authentication Logic in Pseudocode

A simplified reconstruction of the relevant program logic is:

```c
int main(void) {
    char raw_input[128];
    char sanitized_input[128];
    char decoded_password[256];
    int attempts = 3;

    decode_password(decoded_password);
    intro_sequence();

    while (attempts-- > 0) {
        printf("Enter password: ");
        fgets(raw_input, sizeof(raw_input), stdin);

        raw_input[strcspn(raw_input, "\n")] = '\0';

        sanitize(raw_input, sanitized_input);

        printf("Raw Input: [%s]\n", raw_input);
        printf("Sanitized Input: [%s]\n", sanitized_input);

        if (strcmp(raw_input, decoded_password) == 0) {
            auth_sequence();

            FILE *file = fopen("../../root/flag.txt", "r");

            if (file != NULL) {
                char flag[128];

                if (fgets(flag, sizeof(flag), file) != NULL) {
                    printf("Flag: %s\n", flag);
                }

                fclose(file);
            } else {
                puts("Flag file not found.");
            }

            return 0;
        }

        puts("Access Denied");
    }

    puts("All attempts used. Try harder!");
    return 1;
}
```

---

## 18. Most Important Lessons

### Static and dynamic analysis complement each other

Static analysis showed:

- Function names
- Calls
- Loops
- Constants
- Branch instructions
- File paths

Dynamic analysis showed:

- Actual runtime strings
- Register contents
- Comparison results
- CPU flags
- Which branches were taken

### Function names can be misleading

`auth_sequence()` sounded like the authentication function, but it was only reached after the password had already been accepted.

### Verify data flow

The program created a sanitized buffer, but the raw buffer was passed to `strcmp()`.

The correct question was not merely:

> “Does sanitization exist?”

It was:

> “Is the sanitized value actually used by the security decision?”

### Runtime memory can expose decoded secrets

Even when a password is obfuscated in the binary, it must often become usable plaintext before comparison. A breakpoint at the comparison function can expose both operands.

### Comparison functions control branches through return values

Understanding this sequence is essential:

```text
strcmp
→ EAX
→ test
→ Zero Flag
→ conditional jump
```

### Debuggers can alter program state

Changing `EAX` demonstrated that debuggers can modify:

- Registers
- Memory
- Flags indirectly
- Control flow
- Function return values

### Local and remote environments differ

A local binary may reproduce the logic but lack challenge-only resources such as the flag file.

---

## 19. Useful LLDB Commands Learned

### Program control

```lldb
run
continue
next
step
nexti
si
finish
quit
```

### Breakpoints

```lldb
breakpoint set --name strcmp
breakpoint set --name auth_sequence
breakpoint list
```

### Registers

```lldb
register read rdi rsi
register read eax
register read rflags
register write eax 0
```

### Memory

```lldb
x/s $rdi
x/s $rsi
x/32bx <address>
```

### Disassembly

```lldb
disassemble --name main
disassemble --name sanitize
disassemble --name decode_password
disassemble --frame
```

### Symbol lookup

```lldb
image lookup --name strcmp
image lookup --address <address>
```

### Shell commands from LLDB

```lldb
platform shell "objdump -R bypassme.bin"
```

---

## 20. Useful Supporting Commands

```bash
file bypassme.bin
ls -l bypassme.bin
nm -C bypassme.bin
objdump -d -C bypassme.bin
objdump -R bypassme.bin
objdump -s bypassme.bin
strings -n 4 bypassme.bin
```

---

## Final Takeaway

The challenge was not fundamentally about guessing a password.

It was about tracing the real authentication data flow:

```text
Encoded bytes
    ↓ XOR 0xAA
Decoded expected password
    ↓
strcmp(raw input, decoded password)
    ↓
EAX return value
    ↓
test instruction
    ↓
Zero Flag
    ↓
conditional branch
    ↓
success or failure
```

The strongest reverse-engineering habit demonstrated here is:

> Never trust labels, prompts, or apparent security controls. Follow the exact bytes and values that reach the final decision.
