import { Post } from "@/api/domains/post/types";
import ImageCarousel, {
  CarouselImage,
  ImageCarouselProps,
} from "@/components/common/image-carousel";

export type { CarouselImage };

interface PostCarouselProps {
  post: Post;
  overlay?: ImageCarouselProps["overlay"];
  dotsPlacement?: ImageCarouselProps["dotsPlacement"];
  linkable?: ImageCarouselProps["linkable"];
  onFirstImageReady?: ImageCarouselProps["onFirstImageReady"];
}

const PostCarousel = ({ post, ...rest }: PostCarouselProps) => (
  <ImageCarousel
    images={post.images}
    catName={post.cats[0]?.name ?? post.author.nickname}
    postId={post.id}
    {...rest}
  />
);

export default PostCarousel;
