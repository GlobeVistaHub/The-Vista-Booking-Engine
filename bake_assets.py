import os
from PIL import Image, ImageFilter, ImageDraw

def bake_shadow_and_border(input_path, output_path, border_size=8, shadow_offset=(10, 15), shadow_blur=10, shadow_opacity=180):
    print(f"Processing {input_path}...")
    try:
        # Open original image
        img = Image.open(input_path).convert("RGBA")
        
        # Calculate new size to accommodate border and shadow
        padding = max(border_size, shadow_blur) + max(abs(shadow_offset[0]), abs(shadow_offset[1])) + 20
        new_size = (img.width + padding * 2, img.height + padding * 2)
        
        # Extract the alpha channel (mask)
        alpha = img.getchannel('A')
        
        # 1. Create the white border
        # We dilate the alpha channel to create a thicker mask
        border_mask = alpha.filter(ImageFilter.MaxFilter(border_size * 2 + 1))
        
        # Create a solid white image and apply the dilated mask
        border_img = Image.new("RGBA", new_size, (255, 255, 255, 0))
        white_solid = Image.new("RGBA", new_size, (255, 255, 255, 255))
        
        # Paste the border mask onto a larger canvas to avoid clipping
        temp_mask = Image.new("L", new_size, 0)
        temp_mask.paste(border_mask, (padding, padding))
        
        border_img.paste(white_solid, mask=temp_mask)
        
        # 2. Create the drop shadow
        # Create a black image using the same border mask, then offset and blur it
        shadow_img = Image.new("RGBA", new_size, (0, 0, 0, 0))
        black_solid = Image.new("RGBA", new_size, (0, 0, 0, shadow_opacity))
        
        temp_shadow_mask = Image.new("L", new_size, 0)
        # Offset the mask for the shadow
        temp_shadow_mask.paste(border_mask, (padding + shadow_offset[0], padding + shadow_offset[1]))
        # Blur the mask
        temp_shadow_mask = temp_shadow_mask.filter(ImageFilter.GaussianBlur(shadow_blur))
        
        shadow_img.paste(black_solid, mask=temp_shadow_mask)
        
        # 3. Composite everything together
        final_img = Image.new("RGBA", new_size, (0, 0, 0, 0))
        
        # Layer 1: Shadow
        final_img.alpha_composite(shadow_img)
        # Layer 2: White Border
        final_img.alpha_composite(border_img)
        
        # Layer 3: Original Image (centered in the padded canvas)
        temp_original = Image.new("RGBA", new_size, (0, 0, 0, 0))
        temp_original.paste(img, (padding, padding))
        final_img.alpha_composite(temp_original)
        
        final_img.save(output_path)
        print(f"Saved baked asset: {output_path}")
        
    except Exception as e:
        print(f"Error processing {input_path}: {e}")

def main():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    public_dir = os.path.join(base_dir, 'public')
    assets_dir = os.path.join(public_dir, 'assets')
    
    # Process Characters
    chars = ['mazen-transparent.png', 'mariya-transparent.png']
    for char in chars:
        in_path = os.path.join(public_dir, char)
        out_path = os.path.join(public_dir, char.replace('.png', '_baked.png'))
        if os.path.exists(in_path):
            bake_shadow_and_border(in_path, out_path, border_size=12, shadow_offset=(15, 20), shadow_blur=15, shadow_opacity=220)
            
    # Process Narrative Assets
    if os.path.exists(assets_dir):
        for f in os.listdir(assets_dir):
            if f.endswith('.png') and not f.endswith('_baked.png'):
                in_path = os.path.join(assets_dir, f)
                out_path = os.path.join(assets_dir, f.replace('.png', '_baked.png'))
                bake_shadow_and_border(in_path, out_path, border_size=8, shadow_offset=(10, 15), shadow_blur=12, shadow_opacity=200)

if __name__ == '__main__':
    main()
