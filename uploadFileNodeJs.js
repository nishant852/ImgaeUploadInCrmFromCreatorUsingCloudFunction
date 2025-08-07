const request = require("request");

module.exports = async function (context, basicIO) {
    const creatorFileRecordId = basicIO.getParameter("creatorFileRecordId"); // Zoho Creator record ID
    const auth_token = basicIO.getParameter("auth_token"); // Zoho Creator record ID
    const reportName = basicIO.getParameter("reportName"); 
    const fieldLinkName = basicIO.getParameter("fieldLinkName"); 
    const authToken = "Zoho-oauthtoken " + auth_token; // OAuth token

    // Step 1: Download image from Zoho Creator
    const downloadFile = () => {
        return new Promise((resolve, reject) => {
            const requestConfig = {
                url: `https://www.zohoapis.eu/creator/v2.1/data/solistractors/solis-deal-management/report/${reportName}/${creatorFileRecordId}/${fieldLinkName}/download`,
                method: "GET",
                headers: {
                    Authorization: authToken
                },
                encoding: null
            };

            request(requestConfig, function (err, response, body) {
                if (err) return reject("Download failed: " + err.toString());

                const contentDisposition = response.headers["content-disposition"];
                let filename = "image.jpg";
                if (contentDisposition && contentDisposition.includes("filename=")) {
                    filename = contentDisposition.split("filename=")[1].replace(/['"]/g, "");
                }

                resolve({ filename, buffer: body });
            });
        });
    };

    // Step 2: Upload image to CRM via /files API
    const uploadFileToCRM = ({ filename, buffer }) => {
        return new Promise((resolve, reject) => {
            const options = {
                url: `https://www.zohoapis.eu/crm/v2/files`,
                method: "POST",
                headers: {
                    Authorization: authToken
                },
                formData: {
                    file: {
                        value: buffer,
                        options: {
                            filename: filename,
                            contentType: "image/jpeg"
                        }
                    }
                }
            };

            request(options, function (err, response, body) {
                if (err) return reject("File upload failed: " + err.toString());

                try {
                    const result = JSON.parse(body);
                    if (result.data && result.data[0].code === "SUCCESS") {
                        const fileId = result.data[0].details.id;
                        context.log.INFO("✅ Step 2 Response: " + JSON.stringify(result.data[0]));
                        resolve(fileId);
                    } else {
                        reject("File upload error: " + body);
                    }
                } catch (e) {
                    reject("Upload parse error: " + e.toString());
                }
            });
        });
    };

    // Run Step 1 and 2 only
    try {
        context.log.INFO("🚀 Execution started");
        const file = await downloadFile();
        context.log.INFO("📥 Step 1: File downloaded: " + file.filename);

        const fileId = await uploadFileToCRM(file);
        context.log.INFO("📤 Step 2: File uploaded to CRM. File ID: " + fileId);

        // Return just the fileId
        basicIO.write({ fileId: fileId });
    } catch (err) {
        context.log.INFO("❌ Error: " + err);
        basicIO.write({ error: err.toString() });
    }
};
