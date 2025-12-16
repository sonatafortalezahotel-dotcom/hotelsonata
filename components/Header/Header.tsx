import HeaderContent from "./HeaderContent";

interface HeaderProps {
  locale?: string;
  usePrimaryBackground?: boolean;
}

export default function Header({ usePrimaryBackground = false }: HeaderProps) {
  return <HeaderContent usePrimaryBackground={usePrimaryBackground} />;
}
