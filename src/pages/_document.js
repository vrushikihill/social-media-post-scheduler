// ** React Import
import { Children } from 'react'

// ** Next Import
import Document, { Html, Head, Main, NextScript } from 'next/document'
import Script from 'next/script'

// ** Emotion Imports
import createEmotionServer from '@emotion/server/create-instance'

// ** Utils Imports
import { createEmotionCache } from 'src/@core/utils/create-emotion-cache'

class CustomDocument extends Document {
  render() {
    return (
      <Html lang='en'>
        <Head>
          <link rel='preconnect' href='https://fonts.googleapis.com' />
          <link rel='preconnect' href='https://fonts.gstatic.com' />
          <link
            rel='stylesheet'
            href='https://fonts.googleapis.com/css2?family=Public+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&display=swap'
          />
          <link rel='apple-touch-icon' sizes='180x180' href='/images/ceramic-portal-logo.svg' />
          <link rel='shortcut icon' href='/images/ceramic-portal-logo.svg' />
        </Head>

        <body>
          <Main />
          <NextScript />

          {/* Facebook SDK */}
          <Script
            id='facebook-sdk'
            strategy='afterInteractive'
            dangerouslySetInnerHTML={{
              __html: `
                window.fbAsyncInit = function () {
                  FB.init({
                    appId: '${process.env.NEXT_PUBLIC_FB_APP_ID}',
                    cookie: true,
                    xfbml: false,
                    version: 'v19.0'
                  });
                };

                (function (d, s, id) {
                  if (d.getElementById(id)) return;
                  var js = d.createElement(s);
                  js.id = id;
                  js.src = "https://connect.facebook.net/en_US/sdk.js";
                  var fjs = d.getElementsByTagName(s)[0];
                  fjs.parentNode.insertBefore(js, fjs);
                })(document, 'script', 'facebook-jssdk');
              `
            }}
          />
        </body>
      </Html>
    )
  }
}

CustomDocument.getInitialProps = async ctx => {
  const originalRenderPage = ctx.renderPage
  const cache = createEmotionCache()
  const { extractCriticalToChunks } = createEmotionServer(cache)

  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: App => props => <App {...props} emotionCache={cache} />
    })

  const initialProps = await Document.getInitialProps(ctx)
  const emotionStyles = extractCriticalToChunks(initialProps.html)

  const emotionStyleTags = emotionStyles.styles.map(style => (
    <style
      key={style.key}
      dangerouslySetInnerHTML={{ __html: style.css }}
      data-emotion={`${style.key} ${style.ids.join(' ')}`}
    />
  ))

  return {
    ...initialProps,
    styles: [...Children.toArray(initialProps.styles), ...emotionStyleTags]
  }
}

export default CustomDocument
