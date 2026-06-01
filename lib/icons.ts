import { cssInterop } from "nativewind"
import { Heart, MessageCircle, Bookmark, MoreVertical, X } from "lucide-react-native"

cssInterop(Heart, {
  className: {
    target: "style",
    nativeStyleToProp: {
      color: true,
      fill: true,
    },
  },
})

cssInterop(MessageCircle, {
  className: {
    target: "style",
    nativeStyleToProp: {
      color: true,
      fill: true,
    },
  },
})
cssInterop(Bookmark, {
  className: {
    target: "style",
    nativeStyleToProp: {
      color: true,
      fill: true,
    },
  },
})
cssInterop(X, {
  className: {
    target: "style",
    nativeStyleToProp: {
      color: true,
    },
  },
})

export { Heart, MessageCircle, Bookmark, MoreVertical, X }
