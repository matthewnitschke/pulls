import { Box } from "@mui/material";

export const Placeholder = (props) => {
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
