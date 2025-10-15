import React, {memo} from 'react';
import Svg, {G, Polygon, Rect, Path, Polyline, Line} from 'react-native-svg';
import {withTheme} from '@emotion/react';

const SvgComponent = ({color, theme, ...props}) => (
  <Svg width={20} height={20} viewBox="0 0 18 18" {...props}>
    <G fill={color || theme.colors.primary}>
      <Polygon points="6 6.868 6 6 5 6 5 7 5.942 7 6 6.868" />
      <Rect height={1} width={1} x={4} y={4} />
      <Polygon points="6.817 5 6 5 6 6 6.38 6 6.817 5" />
      <Rect height={1} width={1} x={2} y={6} />
      <Rect height={1} width={1} x={3} y={5} />
      <Rect height={1} width={1} x={4} y={7} />
      <Polygon points="4 11.439 4 11 3 11 3 12 3.755 12 4 11.439" />
      <Rect height={1} width={1} x={2} y={12} />
      <Rect height={1} width={1} x={2} y={9} />
      <Rect height={1} width={1} x={2} y={15} />
      <Polygon points="4.63 10 4 10 4 11 4.192 11 4.63 10" />
      <Rect height={1} width={1} x={3} y={8} />
      <Path d="M10.832,4.2L11,4.582V4H10.708A1.948,1.948,0,0,1,10.832,4.2Z" />
      <Path d="M7,4.582L7.168,4.2A1.929,1.929,0,0,1,7.292,4H7V4.582Z" />
      <Path d="M8,13H7.683l-0.351.8a1.933,1.933,0,0,1-.124.2H8V13Z" />
      <Rect height={1} width={1} x={12} y={2} />
      <Rect height={1} width={1} x={11} y={3} />
      <Path d="M9,3H8V3.282A1.985,1.985,0,0,1,9,3Z" />
      <Rect height={1} width={1} x={2} y={3} />
      <Rect height={1} width={1} x={6} y={2} />
      <Rect height={1} width={1} x={3} y={2} />
      <Rect height={1} width={1} x={5} y={3} />
      <Rect height={1} width={1} x={9} y={2} />
      <Rect height={1} width={1} x={15} y={14} />
      <Polygon points="13.447 10.174 13.469 10.225 13.472 10.232 13.808 11 14 11 14 10 13.37 10 13.447 10.174" />
      <Rect height={1} width={1} x={13} y={7} />
      <Rect height={1} width={1} x={15} y={5} />
      <Rect height={1} width={1} x={14} y={6} />
      <Rect height={1} width={1} x={15} y={8} />
      <Rect height={1} width={1} x={14} y={9} />
      <Path d="M3.775,14H3v1H4V14.314A1.97,1.97,0,0,1,3.775,14Z" />
      <Rect height={1} width={1} x={14} y={3} />
      <Polygon points="12 6.868 12 6 11.62 6 12 6.868" />
      <Rect height={1} width={1} x={15} y={2} />
      <Rect height={1} width={1} x={12} y={5} />
      <Rect height={1} width={1} x={13} y={4} />
      <Polygon points="12.933 9 13 9 13 8 12.495 8 12.933 9" />
      <Rect height={1} width={1} x={9} y={14} />
      <Rect height={1} width={1} x={8} y={15} />
      <Path d="M6,14.926V15H7V14.316A1.993,1.993,0,0,1,6,14.926Z" />
      <Rect height={1} width={1} x={5} y={15} />
      <Path d="M10.668,13.8L10.317,13H10v1h0.792A1.947,1.947,0,0,1,10.668,13.8Z" />
      <Rect height={1} width={1} x={11} y={15} />
      <Path d="M14.332,12.2a1.99,1.99,0,0,1,.166.8H15V12H14.245Z" />
      <Rect height={1} width={1} x={14} y={15} />
      <Rect height={1} width={1} x={15} y={11} />
    </G>
    <Polyline
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      stroke={color || theme.colors.primary}
      fill="none"
      points="5.5 13 9 5 12.5 13"
    />
    <Line
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      stroke={color || theme.colors.primary}
      fill="none"
      x1={11.63}
      x2={6.38}
      y1={11}
      y2={11}
    />
  </Svg>
);

export default memo(withTheme(SvgComponent));
