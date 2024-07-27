import Box from "@mui/material/Box";

export default function EmptyCircle() {
  return (
    <Box
      sx={{
        width: '24px',
        height: '24px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Box
        sx={{
          width: '14px',
          height: '14px',
          borderRadius: '50%',
          border: 'solid 2px #768390',
          margin: 'auto'
        }}
      ></Box>
    </Box>
  );
}
