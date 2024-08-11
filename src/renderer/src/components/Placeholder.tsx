import { Box } from "@mui/material";

interface PlaceholderProps {
  depth: number
}

export const Placeholder = (props: PlaceholderProps) => {
  return <Box
    sx={{
      left: props.depth * 24,
      backgroundColor: '#1967d2',
      height: '2px',
      position: 'absolute',
      right: '0px',
      top: '0px',
      transform: 'translateY(-50%)px',
    }}
  ></Box>
};
