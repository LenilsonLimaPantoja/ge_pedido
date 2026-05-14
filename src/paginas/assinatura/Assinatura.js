import { Alert, View } from 'react-native';
import SignatureScreen from 'react-native-signature-canvas';
import ModalAlert from '../../componentes/ModalAlert';
import AppBarModalClose from '../../componentes/AppBarModalClose';

const Assinatura = ({ openCloseModal, setOpenCloseModal, handleEnviarComprovante }) => {

  const handleSignature = (signature) => {
    handleEnviarComprovante(signature);
  };

  return (
    <ModalAlert funcao={() => setOpenCloseModal(false)} openModal={openCloseModal} ocultarInfoGe={true} scroll={true}>
      <AppBarModalClose funcao={() => setOpenCloseModal(false)} texto='ASSINATURA DO COMPROVANTE' />
      <View style={{ minHeight: 330 }}>
        <SignatureScreen
          onOK={handleSignature}
          onEmpty={() => {
            Alert.alert('ATENÇÃO',
              'Assinatura vazia, tente novamente!',
              [
                { text: 'confirmar', onPress: () => () => setOpenCloseModal(false) },
              ]
            );
          }}
          descriptionText="Assine aqui"
          clearText="Limpar"
          confirmText="Assinar"
          autoClear={false}
          webStyle={`
            .m-signature-pad{
              box-shadow: none;
              height: 270px;
              border: none;
            }

            .m-signature-pad--body canvas{
              background-color: #fff;
              border-radius: 0px;
            }

            .m-signature-pad--footer {
              padding: 0px 10px;
            }

            .button {
              background-color: #1769aa;
              color: #fff;
              font-size: 16px;
              border-radius: 10px;
            }
        
            .button.clear {
              background-color: #f44336;
            }
          `}
        />
      </View>
    </ModalAlert>
  );
};

export default Assinatura;