import { ErrorOutline, NavigateNext } from "@mui/icons-material";
import { Breadcrumbs, CircularProgress, Stack, Typography } from "@mui/material";
import { useAppSelector } from "@renderer/redux/store";
import SelectedPrsDetailMenu from "./SelectedPrsDetailMenu";
import SelectQueryMenu from "./SelectQueryLink";
import FilterInput from "./FilterInput";

interface HeaderProps {
  onGroupClick: () => void;
}

export default function Header(props: HeaderProps) {
  let prQueryStatus = useAppSelector((state) => state.prs.status);
  let selectedPrIds = useAppSelector((state) => state.selectedPrs);

  return <Stack>
    <Stack
      direction='row'
      justifyContent='space-between'
      alignItems='center'
      sx={{
        px: 2,
        height: '53px',
        backgroundColor: 'background.paper',
        borderTopLeftRadius: '11px',
        borderTopRightRadius: '11px',
      }}
    >
      <Breadcrumbs separator={<NavigateNext fontSize="small"/>}>
        <Typography color="text.primary" fontSize={'1.1rem'}>PULLS</Typography>
        <SelectQueryMenu />
      </Breadcrumbs>

      <Stack direction='row' alignItems='center'>
        {prQueryStatus == 'loading' && <CircularProgress size="1rem" sx={{ marginLeft: '.5rem' }} />}
        {prQueryStatus == 'error' && <ErrorOutline sx={{ marginLeft: '.5rem' }} />}
        { selectedPrIds.length >= 2 && <SelectedPrsDetailMenu onGroupClick={props.onGroupClick} /> }
      </Stack>
    </Stack>

    <FilterInput />
  </Stack>
}
