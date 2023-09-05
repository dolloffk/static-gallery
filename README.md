# Static accessible gallery generator

This will produce a static version of my [gallery framework](https://kalechips.net/posts/2023-08-21-Image-Gallery). Hooray!

Populate input/images.json with the required files. Each object takes the following keys:

- "img" - image filename. Do not add the path, the generator knows where to find it. Mandatory.
- "alt" - alt text for your image. Mandatory.
- "desc" - long description for your image. Mandatory.
- "comment" - comments/blurb about the image. Optional.

