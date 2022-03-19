import React, { useState } from 'react';
import RNBottomActionSheet from 'react-native-bottom-action-sheet';
import Icon from 'react-native-vector-icons';

function BottomSheet({ navigation, visible, image }) {
    const review = <Icon family={'MaterialIcons'} name={'rate-review'} color={'#000000'} size={30} />
    const record = <Icon family={'MaterialIcons'} name={'book'} color={'#000000'} size={30} />
    
    return (        
        <RNBottomActionSheet.SheetView 
        visible={visible} 
        title={"Options"} 
        theme={"light"} 
        onSelection={(index) => {
            console.log("selection: " + index);
            let next;
            if (index == 0) next = "Questionnaire";
            else if (index == 1) next = "AddEntry";
            navigation.navigate(next, { base64Link: image, review: index==0? true:false });
        }}>
            <RNBottomActionSheet.SheetView.Item 
            title={"Post a review"}
            icon={review}
            />
            <RNBottomActionSheet.SheetView.Item 
            title={"Save as record"} 
            icon={record}
            />
        </RNBottomActionSheet.SheetView>
    );
};

export default BottomSheet;