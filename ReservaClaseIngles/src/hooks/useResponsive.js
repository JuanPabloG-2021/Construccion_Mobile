import {useWindowDimensions} from 'react-native';

export default function useResponsive() {
    const {width, height} = useWindowDimensions();
    const isLandscape = width >= 768;
    const isPortrait = height < width;
    return {
        width,
        height,
        isLandscape,
        isPortrait,
        columns: isLandscape ? 2 : 1,
        ancho: isLandscape ? 320 : Math.min(width*0.72, 300),
        paddingHorizontal: isLandscape ? 32 : 16
    };
}