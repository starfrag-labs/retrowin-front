import {
  AudioTypes,
  ContentTypes,
  ImageTypes,
  VideoTypes,
} from "@/types/content";

export { AudioTypes, ContentTypes, ImageTypes, VideoTypes };

export function getContentTypes(fileName: string) {
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
}
