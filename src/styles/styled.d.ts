import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    shadow: {
      defaultShadow: string;
      buttonShadow: string;
    };
    colors: {
      polarMain: string;
      polarSimpleMain: string;
      polarBackground: string;
      polarBrightMain: string;
      polarGray: string;
      grayOne: string;
      grayTwo: string;
      grayThree: string;
      grayFour: string;
      grayFive: string;
      graySix: string;
      backgoundWhite: string;
      blackOne: string;
      blackTwo: string;
      blackThree: string;
      inputBoxBackgound: string;
      fontGray: string;
      Red: string;
      Yellow: string;
    };
    fontFrame: {
      titleSmall: string;
      titleMedium: string;
      titleLarge: string;
      titleGiant: string;
      subTitleSmall: string;
      subTitleMiddle: string;
      bodySmall: string;
      bodyMiddle: string;
    };
    fontWeight: {
      weightSmall: string;
      weightLarge: string;
    };

    fontSize: {
      sizeSmall: string;
      sizeExtraSmall: string;
      sizeMedium: string;
      sizeExtraMedium: string;
      sizeLarge: string;
      sizeExtraLarge: string;
    };

    font: {
      inter: string;
      sebangGothic: string;
      nanumGothic: string;
    };
    fontColor: {
      titleColor: string;
      blueColor: string;
      whiteColor: string;
      grayColor: string;
    };
  }
}
