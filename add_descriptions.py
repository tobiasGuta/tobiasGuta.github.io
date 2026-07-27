import os
import re

directory = r'd:\Tools\tobiasGuta.github.io\_posts'
for filename in os.listdir(directory):
    if filename.endswith('.md'):
        filepath = os.path.join(directory, filename)
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        if 'description:' not in content:
            # Extract title
            title_match = re.search(r'title:\s*\"?([^\"]+)\"?', content)
            if title_match:
                title = title_match.group(1).strip()
                # Create a description
                desc = f'A detailed walkthrough and notes on {title}.'
                
                # Replace double quotes in description to single quotes to avoid breaking yaml if any
                desc = desc.replace('"', "'")
                
                # Insert description after title
                new_content = re.sub(
                    r'(title:\s*\"?[^\"]+\"?\n)', 
                    f'\\g<1>description: "{desc}"\n', 
                    content, 
                    count=1
                )
                
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f'Added description to {filename}')
            else:
                print(f'No title found in {filename}')
        else:
            print(f'Description already exists in {filename}')
