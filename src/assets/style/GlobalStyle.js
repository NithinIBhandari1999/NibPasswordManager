import { StyleSheet } from 'react-native';

export const GlobalStyle = StyleSheet.create({

    footer: {
        width: "100%",
        backgroundColor: "#FFFFFF",
        display: 'flex',
        flexDirection: 'row',
      },
      footerIconView: {
        flex:1,
      },
      footerIconLeft: {
        margin: 10,
        fontSize: 40,
      },
      footerIconRight: {
        alignSelf: 'flex-end',
        margin: 10,
        fontSize: 40,
      },

});
