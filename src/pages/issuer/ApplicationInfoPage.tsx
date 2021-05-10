import React, { useState } from 'react';
import { useHistory, RouteComponentProps } from 'react-router-dom';
import {Button} from 'react-bootstrap';
import ApiService from 'utils/apiService';
import { routes } from 'constants/routes';
import firebase from 'utils/firebase/firebase';
import {certifiedCPRAEDVCData} from 'utils/vc-data-examples/drivinglicense';
import { sendEmail } from 'utils/templates/email';

interface IProps {
  children?: React.ReactNode,
  location?: any
}

const ApplicationInfoPage: React.FC<IProps & RouteComponentProps> = (props: IProps): React.ReactElement => {
  const [VCschemaData] = useState<any>(JSON.stringify(certifiedCPRAEDVCData));
  const { username, payload, applicationID, docID, approved } = props.location.state.state;
  const { name, holderDid, email} = payload;
  //const { issuerOrganization } = JSON.parse(idClass);

  const history = useHistory();

  const isJson = (str: string) => {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
  }

  /**
   * Function for signing an unsigned VC.
  * */
  const approveVC = async () => {
    try {
      if (isJson(VCschemaData)){
        const example = {...JSON.parse(VCschemaData)}
        example.data.name = name;
        example.data.email = email;
        example.holderDid = holderDid || '';
        
        console.log("Pre-unsigend=", JSON.stringify(example));
        // Build unsigned VC
        const {unsignedVC} = await ApiService.issueUnsignedVC(example);
        console.log("Unsigned=", unsignedVC);
        // Sign the VC
        const {signedCredential} = await ApiService.signVC({
          unsignedCredential: unsignedVC
        })

        // Store the VC
        const {credentialIds} = await ApiService.storeSignedVCs({ data: [signedCredential]})
        
        // Share the credentials
        const claimID: string = credentialIds[0];
        const {qrCode, sharingUrl} = await ApiService.shareCredentials(claimID)
        sendEmail(qrCode, sharingUrl, email)

        const db = firebase.firestore();
        // Store the information under Approved Table
        db.collection('drivinglicense-approved').add({ username, payload, applicationID, approved: true });
        // Delete the information under the Pending Approval Table
        db.collection('drivinglicense-waiting-approval').doc(docID).delete();

        alert('Application has been approved and have alerted the applicant.');
        history.push(routes.ISSUER);
      }
    } catch (error) {
      ApiService.alertWithBrowserConsole(error.message);
    }
  }

  return (
    <div className='tutorial'>
      <div className='tutorial__step'>
        <h3><strong>Application ID:</strong> {applicationID}</h3>
        <p><strong>Name:</strong> {name}</p>
        { !approved ? (
          <>
           <Button style={{display: 'block', margin: '10px 0 0 0'}} onClick={approveVC}>Approve</Button>
           <Button style={{display: 'block', margin: '10px 0 0 0'}} disabled>Reject</Button>
          </>
          ) : null}
      </div>
    </div>
  )
}

export default ApplicationInfoPage;