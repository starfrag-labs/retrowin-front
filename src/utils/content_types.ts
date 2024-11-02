export enum ContentTypes {
  Image = "image",
  Video = "video",
  Audio = "audio",
  Text = "text",
  Unknown = "unknown",
}

export enum ImageTypes {
  PNG = "png",
  JPEG = "jpeg",
  JPG = "jpg",
  GIF = "gif",
  WEBP = "webp",
  SVG = "svg",
}

export enum VideoTypes {
  MP4 = "mp4",
  WEBM = "webm",
  OGG = "ogg",
}

export enum AudioTypes {
  MP3 = "mp3",
  WAV = "wav",
  OGG = "ogg",
}

export const getContentTypes = (fileName: string) => {
  const extension = fileName.split(".").pop();
  if (!extension) {
    return ContentTypes.Text;
  }
  if (Object.values(ImageTypes).includes(extension as ImageTypes)) {
    return ContentTypes.Image;
  }
  if (Object.values(VideoTypes).includes(extension as VideoTypes)) {
    return ContentTypes.Video;
  }
  if (Object.values(AudioTypes).includes(extension as AudioTypes)) {
    return ContentTypes.Audio;
  }
  return ContentTypes.Unknown;
};
