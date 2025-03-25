// This is a replacement for Next.js Image component
export default function Image({ src, alt, width, height, className, ...props }) {
  return (
    <img
      src={src || "/placeholder.svg"}
      alt={alt}
      width={width}
      height={height}
      className={className}
      style={{ objectFit: "cover", ...props.style }}
      {...props}
    />
  )
}

