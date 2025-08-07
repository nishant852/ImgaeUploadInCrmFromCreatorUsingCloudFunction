void warranty.uploadImagesInCrm(string ID, string reportName, string Crm_Record_ID)
{
	access_token = Tokens[ID != 0].Access_Token;
	warr_id = ID.toLong();
	warr_info = Warranty_Claims[ID == warr_id];
	mpQR = Map();
	if(!isBlank(warr_info.Attach_Image_1))
	{
		ImageList1 = List();
		response1 = thisapp.uploadFileNodeJs(access_token,input.ID.toString(),input.reportName,"Attach_Image_1");
		file_id1 = response1.get("output").getJSON("fileId");
		info response1;
		fmp1 = Map();
		fmp1.put("File_Id__s",file_id1);
		ImageList1.add(fmp1);
		mpQR.put("Image_Upload",ImageList1);
	}
	if(!isBlank(warr_info.Attach_Image_2))
	{
		ImageList2 = List();
		response2 = thisapp.uploadFileNodeJs(access_token,input.ID.toString(),input.reportName,"Attach_Image_2");
		file_id2 = response2.get("output").getJSON("fileId");
		fmp2 = Map();
		fmp2.put("File_Id__s",file_id2);
		ImageList2.add(fmp2);
		mpQR.put("Image_Upload1",ImageList2);
	}
	if(!isBlank(warr_info.Attach_Image_3))
	{
		ImageList3 = List();
		response3 = thisapp.uploadFileNodeJs(access_token,input.ID.toString(),input.reportName,"Attach_Image_3");
		file_id3 = response3.get("output").getJSON("fileId");
		fmp3 = Map();
		fmp3.put("File_Id__s",file_id3);
		ImageList3.add(fmp3);
		mpQR.put("Attach_Image_3",ImageList3);
	}
	if(!isBlank(warr_info.Attach_Image_4))
	{
		ImageList4 = List();
		response4 = thisapp.uploadFileNodeJs(access_token,input.ID.toString(),input.reportName,"Attach_Image_4");
		file_id4 = response4.get("output").getJSON("fileId");
		fmp4 = Map();
		fmp4.put("File_Id__s",file_id4);
		ImageList4.add(fmp4);
		mpQR.put("Attach_Image_4",ImageList4);
	}
	DataList = List();
	DataList.add(mpQR);
	FinalMap = Map();
	FinalMap.put("data",DataList);
	info FinalMap;
	responseReport4 = invokeurl
	[
		url :"https://www.zohoapis.eu/crm/v6/Warranty_Claims/" + input.Crm_Record_ID
		type :PUT
		parameters:FinalMap.toString()
		connection:"zohocrm"
	];
	info responseReport4;
}
