import Image from "next/image";

const Logo = ({ className, width, height }: { className?: string, width?: number, height?: number }) => {
  return (
    <Image
      src={"/logo.png"}
      width={width ?? 100}
      height={height ?? 100}
      className={className}
      alt="ThikAche"
    />
  );
};

export default Logo;
