import { styled } from '@mui/material/styles';
import { Rating } from '@mui/material';

export const StyledRating = styled(Rating)({
    '& .MuiRating-iconFilled': {
        color: '#faaf00',
    },
    '& .MuiRating-iconHover': {
        color: '#facc15',
    },
});