"use client"

import React from 'react';
import Image from "next/image";
import Link from "next/link"; 
import Header from "./Header";
import Footer from "./Footer";
import { useEffect } from 'react';

const Home = () => {
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      localStorage.clear();
      window.location.reload();
    }
    
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-fresh to-yellow-gold text-white">
      <Header isLoginPage={false} />
      
      <main className="flex flex-col items-center justify-center gap-16 py-16">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-4 text-white">
            Bem-vindo ao <span className="text-yellow-gold">FlavorForge</span>
          </h1>
          <p className="text-lg sm:text-xl max-w-2xl mx-auto mb-6 text-gray-200">
            A plataforma ideal para você armazenar, descobrir e compartilhar suas receitas favoritas.
            Com uma interface simples e intuitiva, você pode salvar suas receitas em um só lugar e acessar
            sempre que precisar.
          </p>
          <div className="flex justify-center gap-6">
            <Link
              href="/register"
              className="bg-yellow-gold text-gray-800 hover:bg-yellow-gold-dark py-3 px-8 rounded-full text-xl font-semibold transition"
            >
              Cadastre-se
            </Link>
            <Link
              href="/login"
              className="bg-transparent border-2 border-white hover:border-yellow-gold text-white hover:text-yellow-gold py-3 px-8 rounded-full text-xl font-semibold transition"
            >
              Fazer login
            </Link>
          </div>
        </div>

        <div className="text-center mt-16">
          <h2 className="text-3xl font-bold text-white mb-8">Como funciona?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-xl">
              <Image
                src="/img1.png"
                alt="Armazenamento de receitas"
                width={300}
                height={100}
              />
              <h3 className="text-xl font-semibold mt-4 text-gray-800">Armazenar suas receitas</h3>
              <p className="text-gray-600 mt-2">
                Guarde todas as suas receitas favoritas em um único lugar. Nunca mais perca aquela receita
                incrível que você encontrou na internet.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-xl">
              <Image
                src="/img2.png"
                alt="Descubra receitas"
                width={300}
                height={100}
              />
              <h3 className="text-xl font-semibold mt-4 text-gray-800">Descubra novas receitas</h3>
              <p className="text-gray-600 mt-2">
                Explore uma vasta coleção de receitas criadas por outros usuários. Encontre inspirações e
                compartilhe suas criações.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-xl">
              <Image
                src="/img3.png"
                alt="Compartilhe receitas"
                width={300}
                height={100}
              />
              <h3 className="text-xl font-semibold mt-4 text-gray-800">Compartilhe suas receitas</h3>
              <p className="text-gray-600 mt-2">
                Compartilhe suas receitas favoritas com amigos e familiares ou com toda a comunidade de
                cozinheiros.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
