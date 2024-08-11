import GreenCheckmark from "./icons/GreenCheckmark";
import RedXMark from "./icons/RedXMark";
import YellowCircle from "./icons/YellowCircle";
import EmptyCircle from "./icons/EmptyCircle";

interface StatusIconProps {
  state?: string;
}

export default function StatusIcon(props: StatusIconProps) {
  switch (props.state?.toLowerCase() ?? '') {
    case 'success':
      return <GreenCheckmark />;
    case 'pending':
      return <YellowCircle />;
    case 'failure':
      return <RedXMark />;
    default:
      return <EmptyCircle />;
  }
}
