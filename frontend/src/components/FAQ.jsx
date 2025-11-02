import React, { useState } from 'react';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "¿Es seguro?",
      answer: "Sí, nuestra plataforma utiliza encriptación de última generación para proteger todos tus datos. Cumplimos con los más altos estándares de seguridad y privacidad para garantizar que tu información personal y profesional esté siempre protegida."
    },
    {
      question: "¿Tiene algún coste?",
      answer: "Ofrecemos diferentes planes adaptados a tus necesidades. Contamos con un plan gratuito básico y planes premium con funcionalidades avanzadas. Puedes comenzar sin costo alguno y actualizar cuando lo necesites."
    },
    {
      question: "¿Cómo puedo empezar?",
      answer: "Es muy sencillo: 1) Crea tu cuenta gratuita, 2) Completa tu perfil con tu información profesional, 3) Configura tu disponibilidad y servicios, 4) ¡Comienza a recibir reservas! Todo el proceso toma menos de 5 minutos."
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900">
            Preguntas Frecuentes
          </h2>
        </div>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className="bg-white rounded-lg shadow-sm overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium text-gray-900 pr-4">
                  {faq.question}
                </span>
                <svg 
                  className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div 
                className={`transition-all duration-300 ease-in-out ${
                  openIndex === index 
                    ? 'max-h-96 opacity-100' 
                    : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;