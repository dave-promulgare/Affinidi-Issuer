import React, { useState, useContext } from 'react';
import AppContext from 'context/app';
import {Button, FormControl, FormGroup, FormLabel} from 'react-bootstrap';
import ApiService from 'utils/apiService';
import 'pages/application/Application.scss'
import firebase from 'utils/firebase/firebase';
import randomstring from 'randomstring';

interface IBaseVCData {
    name: string;
    email: string;
  }
  
  interface IExtendVCData {
  }
  
  const defaultBaseVCData: IBaseVCData = {
    name: '',
    email: ''
  }
  
  const defaultExtendVCData: IExtendVCData = {
  }

interface IPayload extends IBaseVCData{
  idClass: string;
  holderDid: string
}

const Application: React.FC = (): React.ReactElement => {
    const {appState} = useContext(AppContext);
    const [inputDID, setinputDID] = useState(appState.didToken || '')

    const [baseVCData, setBaseVCData] = useState<IBaseVCData>(defaultBaseVCData)
  
    const [extendVCData, setExtendVCData] = useState<IExtendVCData>(defaultExtendVCData)

    /**
     * Function for issuing an unsigned employment VC.
     * */
    const issueAEDVC = async () => {
        try {
          const { name, email } = baseVCData;

          // Generate a random Affinidi AED ID, which will double up as an application ID
          const applicationID: string = randomstring.generate(10);
          const vcToStringify = {...extendVCData, AEDID: applicationID}
          
          const payload: IPayload = {
            name,
            email,
            idClass: JSON.stringify(vcToStringify),
            holderDid: inputDID || appState.didToken || '',
          }

          console.log("Payload=", JSON.stringify(payload));

          // Store unsignedVC into issuer's datsabase
          const db = firebase.firestore();
          console.log("Firebase db=", db);
          db.collection('drivinglicense-waiting-approval').add({username: appState.username, payload, applicationID})

          alert('You have successfully submitted your application.');
        } catch (error) {
            ApiService.alertWithBrowserConsole(error.message);
        }
    }
    
    const resetToDefaults = () => {
      setinputDID(appState.didToken || '')

      setBaseVCData(defaultBaseVCData)
      setExtendVCData(defaultExtendVCData)
    }
    
    const updateBaseVC = (e: any) => {
      setBaseVCData({...baseVCData, [e.target.name]: e.target.value})
    }

    //const updateExtendBaseVC = (e: any) => {
    //  setExtendVCData({...extendVCData, [e.target.name]: e.target.value})
    //}

    return (
      <div className='tutorial'>
        <div className='tutorial__step'>
          <Button 
            style={{float: 'right'}}
            onClick={e => resetToDefaults()}
            >Clear all fields
          </Button>

          <p><strong>Step 1:</strong>Please fill in details of your AED Certification Credential</p>
          <FormGroup controlId='email'>
            <FormLabel className='label' style={{margin: '10px 0 0 0'}}>Email Address:</FormLabel>
            <FormControl name='email' type='text' value={baseVCData.email} onChange={e => updateBaseVC(e)}/>
          </FormGroup>

          <FormGroup controlId='name'>
            <FormLabel className='label' style={{margin: '10px 0 0 0'}}>Name:</FormLabel>
            <FormControl name='name' type='text' value={baseVCData.name} onChange={e => updateBaseVC(e)}/>
          </FormGroup>
        
          <Button 
            onClick={e => issueAEDVC()}
            >Submit
          </Button>
        </div>
      </div>
    )
}

export default Application;