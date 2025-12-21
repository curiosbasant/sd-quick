import { google } from 'googleapis'

export const sheets = google.sheets('v4').spreadsheets

export async function initializeGoogle() {
  const googleAuth = new google.auth.GoogleAuth({
    // credentials: {
    //   type: 'service_account',
    //   "project_id": "my-ideations",
    //   private_key_id: 'f60d51a72aaf69209680e80455e2cd23fccce5aa',
    //   private_key:
    //     '-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCbm1OKXgu6OjUq\n2YTD9KGDUw8uMCXRH4UzMpIDlNwUqm8hdhJQ0eqF1cSs9TdvU57epVbNdyLGLVlg\nmliVN+X8bJy7hnYU5ktg3b5eDPmIMjrSGWA2MAvXsTEyzFVTGgyup0X6BEZP8TOe\nQKn933pVSs/LGcutibxyYVecBVs5jgH73MGznMU5y86IoEhajgH7WKAW1WzeZYmk\ntvj2Yp7qUUDl1q1f9ejThSzIxCuDej24HhAMWwL4HXgybqtrlXXef+nYPFoInF5j\nEIF1akcZIjQ5YEp5FvLqLTazbNEYHgZZGYjdmLLPpQzksyvR4I28Kw4uq27go+sz\nuHYb1FchAgMBAAECggEAAV5p6zctkjtN2W0lalXeD9ossYLR6leFI/CncSmfj/z5\n0kkIGzblgbziKIVVsgCBzsKUk2UfZK/kb+GbsuBVgRVxgYLKyh9GfXkl4gzqKwUK\nGGwJuSBOEl0oKiK7A2qgvu6QwoTEG5LrGdLGzAlpuZNZZZd5/7JM+pKZozE23rg6\nEAl2vr+DmCRlZElGiwdN2RK2137yhJ1Nac3KFER/Of7LNgct2lB5DtxtQPiR0XF5\nIc/GBMKTwXudvhG7GrgZ/X5I1M4kBA3yWJncttGrfDVHS0T5OyB8gfadY4VxcVPb\nAc8+2slSPB2oJ5dfGgMUqVkDPNRhMHXBmfmsZhHZCwKBgQDMnnusXs6r7v6fMeeW\npZBuTYDuZw26W7iCGWZUri8mz04gFgsADLmIUD41E1GphbOLPTLPwgDPowpxCBWL\n9izjgzJeCmItHbOzq2ttfHnfl7YWF9uV1qxSUlnADAXbC1yH3Sc0YnzNLRtFtCcI\nksUvkipo+yVJahdeHlQB8975ywKBgQDCri+q4pEcVMwPSRp2gxoNLwk+lQIVuu3Z\niXLi3nsv8wmyissQWmsPUuGr0fIL3ayvsHhQtKl1P5glR3IiltfwAtAtZtfQBcqD\n1011XOdjV1d3zz+nfXaOoYp7QZC3+7/KkSY2RUy769skjcnGtkF61nEtJ0KkF1KS\n+b0ZdcgFQwKBgQCle361tq8aadzOzsNnGFsoedHN/NYjY05jGTujPIOxtXKPjIQ0\n9BWQYqUMs6UVnqXH9CSF1XZmdotZQpp6aQuArHgtieRAbIcKxZXKJCNEayO91mmm\nUslmgmdHY/HQZu3ci0TLnuMj5FjsFHiE/H4wrNtTr9lF+GERoyF5ussX5QKBgQCb\n8EhwWgEgL3Awwj63NTZV3xpJjbPY0h2ZBTcIMGt+Me/PmssjMznUUXBAX+/Av3SG\nWhVVmBCwwRrOqZbry+X181rrMxilIS5hQsFhw+P4N8rxRgnX0HB5uT2ikxcnuDid\nOnzgNcxMLpUfh49bYzu5+DE5mNwRcjkLT42/6g8o3wKBgHpJW3u2XkWa3jw18E6Y\nWfe7nyiRdcOAcocDceaeFOmKaH5PzS8Kn6sX6eio/pV6h5EztbkqdHYRiaW97g28\nLHBgEmk7EPIAgEsausBPoRNtsR0xlzZa5b9rmgD0OJwz8Tn88VnZUBny0/CnZLsc\nIknGBgciR6oBaeUnFTH0MvmQ\n-----END PRIVATE KEY-----\n',
    //   client_email: 'my-ideations@appspot.gserviceaccount.com',
    //   client_id: '104416254290850328694',
    //   auth_uri: 'https://accounts.google.com/o/oauth2/auth',
    //   token_uri: 'https://oauth2.googleapis.com/token',
    //   auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
    //   client_x509_cert_url:
    //   'https://www.googleapis.com/robot/v1/metadata/x509/my-ideations%40appspot.gserviceaccount.com',
    //   universe_domain: 'googleapis.com',
    // },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  })
  google.options({
    // @ts-expect-error
    auth: await googleAuth.getClient(),
  })
}
