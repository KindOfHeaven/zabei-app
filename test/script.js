{
    const buttons = document.querySelectorAll('.zabeiapp-button')
    const url = 'http://192.168.0.102:8080'

    buttons.forEach((el) => {
        el.addEventListener('click', function() {

            if (document.querySelector('.zabei-overlay')) {
                document.querySelector('.zabei-overlay').style.display = 'flex'
                return 0;
            }

            let overlay = document.createElement('div')
            let wrapper = document.createElement('div')
            let closer = document.createElement('div')
            let iframe = document.createElement('iframe')

            closer.classList.add('zabey-overlay__closer')

            overlay.classList.add('zabei-overlay')
            overlay.style.position = 'fixed'
            overlay.style.top = '0'
            overlay.style.left = '0'
            overlay.style.width = '100%'
            overlay.style.height = '100%'
            overlay.style.background = 'rgba(0,0,0,.8)'
            overlay.style.display = 'flex'
            overlay.style.alignItems = 'center'
            overlay.style.justifyContent = 'center'

            wrapper.classList.add('zabei-iframe-wrapper')
            wrapper.style.width = '320px'
            wrapper.style.maxHeight = 'calc(100vh - 50px)'
            wrapper.style.borderRadius = '10px'
            wrapper.style.display = 'flex'
            wrapper.style.alignItems = 'center'
            wrapper.style.justifyContent = 'center'
            wrapper.style.position = 'relative'

            let loader = document.createElement('div')
            let loaderInner = document.createElement('div')
            let loaderBar = document.createElement('div')
            let loaderText = document.createElement('div')

            loader.classList.add('zabey-loader')
            loaderInner.classList.add('zabey-loader__inner')
            loaderBar.classList.add('zabey-loader__bar')
            loaderText.classList.add('zabey-loader__text')

            loaderText.innerHTML = 'Пожалуйста, подождите...'

            loaderInner.appendChild(loaderBar)
            loader.appendChild(loaderInner)
            loader.appendChild(loaderText)

            iframe.setAttribute('id', 'zabei-reserved-frame')
            iframe.setAttribute('width', 320)
            iframe.setAttribute('height', 800)
            iframe.setAttribute('src', `${url}/?restaurant-id=${el.getAttribute('zabeiapp-restaurant-id')}`)
            iframe.style.borderRadius = '10px'
            iframe.style.border = 'none'
            iframe.style.display = 'none'

            wrapper.appendChild(loader)
            wrapper.appendChild(iframe)
            loader.appendChild(closer)

            iframe.onload = function() {
                loader.remove()
                iframe.style.display = 'block'
            }

            closer.addEventListener('click', closeZabeiIframe)

            overlay.appendChild(wrapper)
            overlay.addEventListener('click', closeZabeiIframe);

            let style = document.createElement('style')
            style.type = 'text/css'
            let styles = `
                         .zabei-iframe-wrapper * {
                            box-sizing: border-box;
                         }
                         #zabei-reserved-frame {
                            position: relative;
                            z-index: 2;
                            height: calc(100vh - 50px);
                         }
                         .zabey-overlay__closer {
                            position: absolute;
                            z-index: 3;
                            width: 15px;
                            height: 15px;
                            right: 10px;
                            top: 16px;
                            cursor: pointer;
                            transform: rotate(45deg);
                            transform-origin: center center;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                         }
                         
                         .zabey-overlay__closer:after {
                            content: '';
                            display: block;
                            height: 15px;
                            width: 1px;
                            background: #979797;
                         }
                         .zabey-overlay__closer:before {
                            content: '';
                            display: block;
                            width: 15px;
                            height: 1px;
                            background: #979797;
                            position: absolute;
                            left: 0;
                            top: 7px;
                         }
                            
                         .zabey-loader {
                            height: 450px;
                            width: 100%;
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            justify-content: center;
                            position: absolute;
                            flex: 0 0 100%;
                            max-width: 100%;
                            top: calc(50% - 225px);
                            left: 0;
                            z-index: 3;
                            background: #2d2d2d;
                            border-radius: 10px;
                         }   
                         .zabey-loader__inner {
                            width: 50px;
                            height: 50px;
                            flex: 0 0 50px;
                            background: #202020;
                            position: relative;
                            border-radius: 50%;
                         }       
                         .zabey-loader__inner:after {
                           background: #2D2D2D;
                           box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
                           width: 42px;
                           height: 42px;
                           display: block;
                           content: '';
                           position: absolute;
                           left: 4px;
                           top: 4px;
                           border-radius: 50%;
                           z-index: 1;
                         }
                         .zabey-loader__bar {
                           width: 50px;
                           height: 50px;
                           position: absolute;
                           top: 0;
                           right: 0;
                           border-top: 4px solid transparent;;
                           border-right: 4px solid transparent;;
                           border-bottom: 4px solid transparent;;
                           border-left: 4px solid #D86660;
                           background: transparent;
                           border-radius: 50%;
                           z-index: 2;
                           transform-origin: center center;
                           animation: 1s linear 0s infinite spin
                         }

                         .zabey-loader__text {
                            font-family: Montserrat, sans-serif;
                           margin-top: 20px;
                           font-weight: 300;
                           font-size: 12px;
                           line-height: 22px;
                     
                           text-align: center;
                           letter-spacing: -0.015em;
                     
                           color: #707070;
                         }
                         @keyframes spin {100% { transform: rotate(-360deg)  }  }
                         
                         @media (max-width: 500px), (max-height: 500px) {
                            .zabei-iframe-wrapper {
                                width: 100% !important;
                                height: 100% !important;
                                max-height: none !important;
                            }
                            #zabei-reserved-frame {
                                width: 100% !important;
                                height: 100% !important;
                            }    
                         }
            `
            if (style.styleSheet) {
                style.styleSheet.cssText = styles;
            } else {
                style.appendChild(document.createTextNode(styles));
            }
            overlay.appendChild(style)
            document.body.appendChild(overlay)
        })
    })

    window.addEventListener('message', ({ data })=> {
        if (data === 'close') {
            closeZabeiIframe()
        }
    });

    function closeZabeiIframe() {
        document.querySelector('.zabei-overlay').style.display = 'none'
    }
}