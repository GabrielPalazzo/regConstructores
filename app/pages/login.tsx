import { Button, Card } from 'antd'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { UserManager } from 'oidc-client'
import axios from 'axios'
import Mantenimiento from '../components/mantenimiento'
import { getCodigoObra, setToken } from '../services/business'

export default () => {

  const router = useRouter()
  const [userLoaded, setUserLoaded] = useState(null)

  useEffect(() => {
    const { given_token } = router.query

    if (given_token) {
      setToken(given_token)
      router.push('/')
    }

    if (router.asPath.split('=')[0] === '/login#access_token') {

      axios.post('/api/getUserToken', {
        access_token: router.asPath.split("=")[1].split('&')[0]
      }).then(result => {
        setToken(result.data)
        router.push('/')
      })
        .catch(err => router.push('/login'))
    }


  })
  if (process.env.MODO === 'MANTENIMIENTO')
    return <Mantenimiento />

  var randomString = function (length) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  return <div className="">
    <div className="w-1/2 bg-primary-100 float-left h-screen mtop">
      <div className="w-2/3 m-auto " >
        <div>
          <img src="../img/logo.png" style={{ width: '150px' }} />
        </div>
        <div className="text-3xl font-bold"> Hola, te damos la bienvenida al
          <span className="text-primary-500 ml-2">Registro de Constructores</span>
        </div>
        <div className="text-lg pt-2">El Registro Nacional de Constructores de Obra Pública es donde deben inscribirse las empresas que deseen contratar obras con el Estado Nacional.<br />
          <div className="text-lg pt-2 mb-4">Consulte la normativa vigente e instructivos de inscripción y actualización:</div>
          <a className="btnNormativa  " href="https://www.argentina.gob.ar/jefatura/innovacion-publica/onc/registro-nacional-de-constructores/normas-internas" target="_blank">Ver normativa e instructivos</a>
        </div>
      </div>
    </div>
    <div className="w-1/2 bg-primary-500 float-left  h-screen mtop">
      <div className="m-auto w-2/3">
        <div className="text-3xl font-bold pb-4 pt-6 text-white"> Ingresá</div>
        <div className="pb-4 ">
          <Button className="btn " style={{ color: '#0072BB' }} onClick={() => {
            router.push(`${process.env.OPENID_AUTH}&nonce=${randomString(10)}&redirect_uri=${window.location.href}`)
          }} >Soy constructor</Button>

          {/*<Button className="btn " style={{ color: '#EC407A' }}
          >Soy miembro del registro</Button>*/}
          <p className="text-base text-white w-2/3"> Si vas a ingresar como Constructor, se te solicitará tu clave de AFIP.</p>
        </div>
        {/* 
         <Button className="btn " style={{ color: '#EC407A' }} onClick={() => {
            localStorage.setItem('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJSZWdpc3RybyBkZSBDb25zdHJ1Y3RvcmVzIiwiaWF0IjoyMjMzNDQ1NTY2NzcsImF1ZCI6Imh0dHA6Ly9sb2NhbGhvc3QiLCJzdWIiOiJsZW9uYXJkb2xlZW5lbkBnbWFpbC5jb20iLCJHaXZlbk5hbWUiOiJNYXJ0aW4gIiwiU3VybmFtZSI6IklnbGVzaWFzIiwiRW1haWwiOiJsZW9uYXJkb2xlZW5lbkBnbWFpbC5jb20iLCJSb2xlIjpbIkNPTlRST0xBRE9SIl19.7uIIGKpwTvL2EnzLY1UWPmEgVwR3Xw-xW9BwtZHWCb0')
            router.push('/backoffice/bandeja')
          }} >Revisor Back Office</Button>
       <div className="pb-4  text-center w-full">
          <Button type="primary" onClick={() => {
            localStorage.setItem('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJSZWdpc3RybyBkZSBDb25zdHJ1Y3RvcmVzIiwiaWF0IjoxNjA3ODY4NDE0LCJhdWQiOiJodHRwOi8vbG9jYWxob3N0Iiwic3ViIjoibGVvbmFyZG9sZWVuZW5AZ21haWwuY29tIiwiR2l2ZW5OYW1lIjoiQW1hbmNpbyAiLCJTdXJuYW1lIjoiQWxjb3J0YSIsIkVtYWlsIjoibGVvbmFyZG9sZWVuZW5AZ21haWwuY29tIiwiUm9sZSI6WyJTVVBFUlZJU09SIl19.HwSjupVi7GBMZPh6O0ZJq4bQpYFu_xxeGzQjwhTB_j8')
            router.push('/backoffice/bandeja')
          }} block>Supervisor Back Office</Button>
        </div>
        <div className="pb-4  text-center w-full">
          <Button type="primary" onClick={() => {
            localStorage.setItem('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJSZWdpc3RybyBkZSBDb25zdHJ1Y3RvcmVzIiwiaWF0IjoxNjA3ODY4NDE0LCJhdWQiOiJodHRwOi8vbG9jYWxob3N0Iiwic3ViIjoibGVvbmFyZG9sZWVuZW5AZ21haWwuY29tIiwiR2l2ZW5OYW1lIjoiUm9xdWUgIiwiU3VybmFtZSI6IlBlcmV6IiwiRW1haWwiOiJsZW9uYXJkb2xlZW5lbkBnbWFpbC5jb20iLCJSb2xlIjpbIkFQUk9CQURPUiJdfQ.KwDoqXASZ8AtnGw8fQu1KhL3eeKYNl-3Y6dAgbjlFZ4')
            router.push('/backoffice/bandeja')
          }} block>Aprobador Back Office</Button>
        </div>
     
     */}

      </div>

      <style>
        {` 
      .mtop{
        padding-top:20%;
      }
      .btn{backgroung:#ffffff;
      width: 210px;
    margin-right: 10px;
    font-weight: 600;
    margin-bottom: 20px;
  }
  .btnNormativa{
    font-weight: 600;
    margin-bottom: 20px;
    background: #0072BB;
    color:#fff;
    box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.1);
    border-radius: 23px;
    padding: 8px 20px;
  }
      `}
      </style>


    </div>
  </div>
}