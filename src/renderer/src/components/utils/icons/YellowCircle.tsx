import Box from "@mui/material/Box";

export default function YellowCircle() {
  return  <Box
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
        width: '10px',
        height: '10px',
        borderRadius: '50%',
        backgroundColor: '#b58f0f',
        margin: 'auto'
      }}
    ></Box>
  </Box>;
}
