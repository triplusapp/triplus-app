import * as React from "react"
import Svg, {Path, SvgProps} from "react-native-svg"
const BookmarkIcon = (props: SvgProps) => (
    <Svg viewBox="0 0 105 105" {...props}>
        <Path
            d="M74.06 8c6.676 0 11.88 5.883 11.88 12.91v71.62c0 3.728-4.65 5.43-7.056 2.58L52.47 63.83 26.056 95.11c-2.363 2.8-6.894 1.207-7.052-2.386L19 92.53V20.91C19 13.883 24.204 8 30.88 8h43.18Zm0 8H30.88C28.855 16 27 18.098 27 20.91v60.683l22.414-26.544a4 4 0 0 1 5.963-.166l.15.166L77.94 81.593V20.91c0-2.732-1.751-4.79-3.707-4.905L74.06 16Z"
        />
    </Svg>
)
export default BookmarkIcon
