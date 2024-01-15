const size = {
  mobile: '480px',
  tablet: '768px',
  laptopS: '900px',
  laptopM: '1239px',
  desktop: '1240px',
};

const flex = {
  mobile: `(max-width: ${size.mobile})`,
  tablet: `(max-width: ${size.tablet})`,
  laptopS: `(max-width: ${size.laptopS})`,
  laptopM: `(max-width: ${size.laptopM})`,
  desktop: `(min-width: ${size.desktop})`,
};

const color = {
  mainColor: '#002878',
  subColor: '#7B97CE',
  inputColor: '#f7f9fc',
  shadowColor: '#787878',
  backgroundColor: '#e5e5e5',
  lineColor: '#e1e0e2',
};

const typography = {
  englishFont: 'Lexend',
  koFont: 'Noto Sans KR',
};

const theme = {
  ...flex,
  ...color,
  ...typography,
};

export default theme;
