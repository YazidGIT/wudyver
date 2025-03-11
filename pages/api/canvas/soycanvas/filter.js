import soycanvas from "soycanvas";
export default async function handler(req, res) {
  const {
    type = "affect",
      image = "https://png.pngtree.com/thumb_back/fw800/background/20230117/pngtree-girl-with-red-eyes-in-anime-style-backdrop-poster-head-photo-image_49274352.jpg",
      image2 = "https://png.pngtree.com/thumb_back/fw800/background/20230117/pngtree-girl-with-red-eyes-in-anime-style-backdrop-poster-head-photo-image_49274352.jpg"
  } = req.method === "GET" ? req.query : req.body;
  if (!type || !image) {
    return res.status(400).json({
      error: "Missing required parameters: type or image"
    });
  }
  try {
    let filteredImage;
    switch (type) {
      case "affect":
        filteredImage = await soycanvas.Image.affect(image);
        break;
      case "batslap":
        if (!image2) return res.status(400).json({
          error: "Missing image2 for batslap"
        });
        filteredImage = await soycanvas.Image.batslap(image, image2);
        break;
      case "beautiful":
        filteredImage = await soycanvas.Image.beautiful(image);
        break;
      case "darkness":
        if (!req.query.intensity) return res.status(400).json({
          error: "Missing intensity for darkness"
        });
        filteredImage = await soycanvas.Image.darkness(image, parseInt(req.query.intensity));
        break;
      case "delete":
        filteredImage = await soycanvas.Image.delete(image);
        break;
      case "gay":
        filteredImage = await soycanvas.Image.gay(image);
        break;
      case "greyscale":
        filteredImage = await soycanvas.Image.greyscale(image);
        break;
      case "invert":
        filteredImage = await soycanvas.Image.invert(image);
        break;
      case "kiss":
        if (!image2) return res.status(400).json({
          error: "Missing image2 for kiss"
        });
        filteredImage = await soycanvas.Image.kiss(image, image2);
        break;
      default:
        return res.status(400).json({
          error: "Invalid type specified"
        });
    }
    res.setHeader("Content-Type", "image/png");
    res.status(200).send(filteredImage);
  } catch (error) {
    res.status(500).json({
      error: `Failed to apply filter: ${error.message}`
    });
  }
}