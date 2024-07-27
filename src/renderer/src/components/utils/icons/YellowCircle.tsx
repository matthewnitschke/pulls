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
        width: '12px',
        height: '12px',
        borderRadius: '50%',
        backgroundColor: '#dbab09',
        margin: 'auto'
      }}
    ></Box>
  </Box>;
}
