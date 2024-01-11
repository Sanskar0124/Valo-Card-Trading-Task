import React, { useState, useEffect } from 'react'


import WebRouter from '../router/web-router'
import Navbar from '../layouts/Navbar/Navbar'
// import Footer from '../layouts/Footer/Footer'

const Index = (props) => {

    return (
        <>
            {/* <Loader /> */}
            <Navbar />
            <WebRouter />
            {/* <Footer /> */}
        </>
    )
}

export default Index;
