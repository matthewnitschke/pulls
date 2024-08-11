import { Search } from "@mui/icons-material";
import { Box, TextField } from "@mui/material";
import { useAppDispatch, useAppSelector } from "@renderer/redux/store";
import { setFilter } from "@renderer/redux/filter_slice";

export default function FilterInput() {
  const dispatch = useAppDispatch();
  let filterText = useAppSelector((state) => state.filter);

  return <Box
    sx={{
      px: '.7rem',
      background: 'linear-gradient(to bottom, #2d333b 50%, transparent 50%)'
    }}
  >
    <TextField
      variant="outlined"
      fullWidth
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: '2rem',
          backgroundColor: 'background.default',
          zIndex: 9001,

          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderWidth: '1px', // dont increase the width on selection
          },
        },

        '& .MuiOutlinedInput-input': {
          padding: '.15rem 1rem',
          fontWeight: 400,
        },
      }}
      InputProps={{
        endAdornment: <Search fontSize="small" />
      }}
      value={filterText}
      onChange={(e) => dispatch(setFilter(e.target.value))}
    />
  </Box>
}
