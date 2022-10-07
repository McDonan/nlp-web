import React from 'react'
import ReactDOM from 'react-dom'
import AxiosProvider from './libs/axios'
// import ReactDOMClient from 'react-dom/client'
import { RecoilRoot } from 'recoil'
import './index.css'
import { QueryClient, QueryClientProvider } from 'react-query'
import App from './App'
import reportWebVitals from './reportWebVitals'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
      refetchOnWindowFocus: false,
      refetchOnMount: true,
    },
  },
})

ReactDOM.render(
  <RecoilRoot>
    <QueryClientProvider client={queryClient}>
      <AxiosProvider>
        <App />
      </AxiosProvider>
    </QueryClientProvider>
  </RecoilRoot>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
