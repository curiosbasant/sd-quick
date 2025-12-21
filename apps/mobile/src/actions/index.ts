import { initializeGoogle,  sheets } from "~/lib/google-sheet";

export async function letsee() {
  await initializeGoogle()
    await sheets.values.update({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: `Sheet1!A1:D1`,
    valueInputOption: 'RAW', // RAW or USER_ENTERED based on your data
    requestBody: {
      values: [[1,2,3,4]],
    },
  })
}
