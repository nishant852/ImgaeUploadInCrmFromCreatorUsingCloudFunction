int warranty.deleteImagesInCrm(int warranty_id)
{
	warranty_info = Warranty_Claims[ID == input.warranty_id];
	Crm_Record_ID = warranty_info.CRM_ID;
	mpQR = Map();
	if(!isBlank(Crm_Record_ID))
	{
		i = 0;
		crm_search_res = invokeurl
		[
			url :"https://www.zohoapis.eu/crm/v6/Warranty_Claims/" + Crm_Record_ID
			type :GET
			connection:"zohocrm"
		];
		crm_data = crm_search_res.get("data");
		crm_image1 = ifNull(crm_data.getJSON("Image_Upload"),"");
		crm_image2 = ifNull(crm_data.getJSON("Image_Upload1"),"");
		crm_image3 = ifNull(crm_data.getJSON("Attach_Image_3"),"");
		crm_image4 = ifNull(crm_data.getJSON("Attach_Image_4"),"");
		if(!isBlank(crm_image1) && warranty_info.Attach_Image_1_Check)
		{
			i = 1;
			ImageList1 = List();
			crm_image1_id = crm_image1.getJSON("id");
			del1 = Map();
			del1.put("_delete",null);
			del1.put("id",crm_image1_id);
			ImageList1.add(del1);
			mpQR.put("Image_Upload",ImageList1);
		}
		if(!isBlank(crm_image2) && warranty_info.Attach_Image_2_Check)
		{
			i = 1;
			ImageList2 = List();
			crm_image2_id = crm_image2.getJSON("id");
			del2 = Map();
			del2.put("_delete",null);
			del2.put("id",crm_image2_id);
			ImageList2.add(del2);
			mpQR.put("Image_Upload1",ImageList2);
		}
		if(!isBlank(crm_image3) && warranty_info.Attach_Image_3_Check)
		{
			i = 1;
			ImageList3 = List();
			crm_image3_id = crm_image3.getJSON("id");
			del3 = Map();
			del3.put("_delete",null);
			del3.put("id",crm_image3_id);
			ImageList3.add(del3);
			mpQR.put("Attach_Image_3",ImageList3);
		}
		if(!isBlank(crm_image4) && warranty_info.Attach_Image_4_Check)
		{
			i = 1;
			ImageList4 = List();
			crm_image4_id = crm_image4.getJSON("id");
			del4 = Map();
			del4.put("_delete",null);
			del4.put("id",crm_image4_id);
			ImageList4.add(del4);
			mpQR.put("Attach_Image_4",ImageList4);
		}
		if(i == 1)
		{
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
			if(responseReport4.getJSON("data").getJSON("code"))
			{
				warranty_info.Attach_Image_1_Check=false;
				warranty_info.Attach_Image_2_Check=false;
				warranty_info.Attach_Image_3_Check=false;
				warranty_info.Attach_Image_4_Check=false;
				thisapp.warranty.uploadImagesInCrm(input.warranty_id.toString(),"Warranty_Claims_Report",warranty_info.CRM_ID.toString());
			}
		}
	}
	return 0;
}
