import { Locale } from "@/lib/context/LanguageContext";

export const pageTranslations = {
  pt: {
    // Página de Quartos
    rooms: {
      hero: {
        title: "Quartos com Vista para o Mar",
        subtitle: "Todos os nossos quartos oferecem vista privilegiada para o mar. Desperte com o sol nascendo sobre as águas da Praia de Iracema."
      },
      section: {
        title: "Escolha Sua Acomodação",
        subtitle: "Conforto, sofisticação e a vista mais bonita de Fortaleza"
      },
      empty: "Nenhum quarto disponível no momento.",
      cta: {
        title: "Pronto para Sua Experiência?",
        subtitle: "Reserve agora e garanta as melhores tarifas e condições especiais",
        bookNow: "Reservar Agora",
        contact: "Fale Conosco"
      },
      highlights: {
        comfort: { title: "Conforto Premium", description: "Camas confortáveis e roupas de cama de alta qualidade" },
        view: { title: "Vista para o Mar", description: "Quartos com vista privilegiada para a Praia de Iracema" },
        ac: { title: "Ar-Condicionado", description: "Climatização individual em todos os quartos" }
      },
      gallery: {
        title: "Acorde com Vista para o Mar",
        subtitle: "Quartos elegantes e confortáveis com vistas privilegiadas da Praia de Iracema",
        items: {
            suite: "Suite Premium",
            standard: "Elegância",
            reception: "Atendimento 24h",
            common: "Áreas Comuns",
            pool: "Vista da Piscina"
        }
      },
      photoStory: {
        title: "Detalhes que Fazem Diferença",
        subtitle: "Cada elemento foi pensado para proporcionar máximo conforto e bem-estar",
        items: {
            beds: { title: "Camas Premium", description: "Colchões de alta qualidade com roupas de cama premium. Travesseiros macios e edredons aconchegantes para garantir noites de sono perfeitas." },
            view: { title: "Vista Deslumbrante", description: "Acorde todos os dias com vista para o oceano Atlântico. Quartos estrategicamente posicionados para aproveitar o nascer do sol." },
            modern: { title: "Ambientes Modernos", description: "Design contemporâneo com toques locais. Ar-condicionado individual, TV smart, frigobar e amenities de qualidade." },
            shared: { title: "Espaços Compartilhados", description: "Além do conforto do quarto, desfrute de áreas comuns como piscina, terraço e jardins para momentos de lazer." }
        }
      }
    },
    // Página de Gastronomia
    gastronomy: {
      hero: {
        title: "Gastronomia que Encanta",
        subtitle: "Sabores autênticos, ingredientes locais e a melhor vista de Fortaleza"
      },
      breakfast: {
        badge: "Premiado",
        title: "Café da Manhã Premiado",
        description: "Comece seu dia com um café da manhã inesquecível. Nossa seleção especial inclui frutas tropicais frescas, pães artesanais, tapiocas preparadas na hora, e o melhor café regional.",
        scheduleTitle: "Horário",
        scheduleWeekday: "Segunda a Sexta: 6h30 às 10h",
        scheduleWeekend: "Sábados e Domingos: 7h às 10h30",
        highlightsTitle: "Destaques"
      },
      restaurant: {
        title: "Restaurante",
        description: "Desfrute de pratos que celebram a rica culinária cearense, preparados com ingredientes frescos e locais. Nossa cozinha combina tradição e inovação para criar experiências gastronômicas memoráveis.",
        scheduleTitle: "Horário de Funcionamento",
        lunch: "Almoço: 12h às 15h",
        dinner: "Jantar: 18h30 às 22h",
        ourKitchen: "Nossa Cozinha"
      },
      roomService: {
        title: "Room Service",
        description: "Desfrute de nossas delícias no conforto do seu quarto. Serviço disponível 24 horas para sua comodidade.",
        available: "Disponível 24 horas"
      },
      cta: {
        title: "Reserve e Saboreie",
        subtitle: "Café da manhã incluído em todas as reservas. Venha experimentar!",
        bookNow: "Fazer Reserva"
      },
      highlightsList: {
        tapioca: "Tapiocas e crepiocas preparadas na hora",
        fruits: "Frutas tropicais da estação",
        breads: "Pães e bolos artesanais",
        coffee: "Café regional premiado",
        vegan: "Opções vegetarianas e veganas",
        view: "Vista panorâmica para o mar"
      },
      gallery: {
        breakfast: { title: "Comece o Dia com Sabor", subtitle: "Buffet completo com iguarias regionais, frutas tropicais e tapiocas feitas na hora", badge: "Café da Manhã Regional" },
        restaurant: { title: "Experiência Gastronômica Completa", subtitle: "Do café da manhã ao jantar, cada refeição é uma celebração dos sabores cearenses", badge: "Nosso Restaurante" },
        items: {
            buffet: "Buffet Completo",
            tapioca: "Tapiocas na Hora",
            fruits: "Frutas Frescas",
            breads: "Pães e Bolos Caseiros",
            juices: "Sucos e Vitaminas",
            coffee: "Café Cearense",
            environment: "Ambiente Sofisticado",
            table: "Vista para o Mar",
            dishes: "Alta Gastronomia",
            ocean: "Do Oceano para Você",
            flavor: "Sabores do Ceará",
            moment: "Momentos Especiais"
        }
      },
      photoStory: {
        title: "Do Mar para Sua Mesa",
        subtitle: "Uma jornada gastronômica pelos sabores do Ceará",
        items: {
            restaurant: { title: "Restaurante com Vista", description: "Ambiente elegante e aconchegante com vista para o mar. O cenário perfeito para suas refeições, seja um almoço executivo ou um jantar romântico." },
            seafood: { title: "Frutos do Mar Frescos", description: "Trabalhamos somente com frutos do mar frescos, direto dos pescadores locais. Lagosta, camarão, peixe e outros delícias do oceano preparados com maestria." },
            chef: { title: "Chef's Special", description: "Nosso chef cria pratos exclusivos que mesclam técnicas contemporâneas com os sabores tradicionais da culinária cearense." },
            breakfast: { title: "Café da Manhã Premiado", description: "Reconhecido pelos hóspedes como um dos melhores cafés da manhã de Fortaleza. Variedade, qualidade e vista para o mar." }
        }
      }
    },
    // Página de Lazer
    leisure: {
      hero: {
        title: "Sua Verdadeira Sala de Estar",
        subtitle: "A Praia de Iracema é o coração cultural de Fortaleza. E você está no melhor lugar para vivê-la intensamente."
      },
      section: {
        title: "Experiências Inesquecíveis",
        subtitle: "Atividades e lazer para todos os momentos da sua estadia"
      },
      location: {
        badge: "Praia de Iracema",
        title: "Coração Cultural de Fortaleza",
        description: "Localizado na icônica Praia de Iracema, você está a passos de distância dos principais pontos turísticos, restaurantes renomados, vida noturna vibrante e da cultura autêntica cearense."
      },
      cta: {
        title: "Viva a Experiência Completa",
        subtitle: "Reserve agora e aproveite todas as atividades incluídas na sua estadia",
        bookNow: "Fazer Reserva"
      },
      photoStory: {
        title: "Seu Dia de Lazer Completo",
        subtitle: "Atividades gratuitas e pagas para todos os gostos",
        items: {
            gym: { title: "Academia com Vista", description: "Inicie o dia com exercícios em nossa academia climatizada com vista para o mar. Equipamentos modernos e ambiente reservado disponível das 6h às 22h.", time: "6:00 - 22:00" },
            tennis: { title: "Beach Tennis Gratuito", description: "Aulas gratuitas com professor especializado. Material incluso, apenas aproveite o sol e a diversão com vista para o mar de Fortaleza.", time: "10:00" },
            bike: { title: "Passeio de Bicicleta", description: "Serviço gratuito de bicicletas para explorar a Praia de Iracema, Ponte dos Ingleses e Centro Dragão do Mar. Aventure-se pela cidade!", time: "Todo o dia" },
            spa: { title: "Massagens e Spa", description: "Sessões de massagem terapêutica com agendamento prévio. Relaxe e renove suas energias em um ambiente tranquilo e acolhedor.", time: "Com agendamento" }
        }
      },
      gallery: {
        pool: { title: "Relaxe Frente ao Mar", subtitle: "Vista privilegiada, espreguiçadeiras confortáveis e atendimento do restaurante na área da piscina", badge: "Piscina com Vista" },
        fitness: { title: "Mantenha sua Rotina de Exercícios", subtitle: "Academia climatizada com equipamentos modernos e vista para o mar", badge: "Espaço Fitness" },
        activities: { title: "Diversão para Toda a Família", subtitle: "Beach tennis, bicicletas e muito mais inclusos na sua hospedagem", badge: "Atividades Gratuitas" },
        spa: { title: "Momentos de Puro Relaxamento", subtitle: "Massagens terapêuticas em ambiente tranquilo e acolhedor", badge: "Spa & Bem-Estar" },
        items: {
            view: "Vista Panorâmica",
            leisure: "Área de Lazer",
            relax: "Relaxamento",
            golden: "Golden Hour",
            outdoor: "Espaço ao Ar Livre",
            hotelView: "Vista do Hotel",
            modern: "Equipamentos Modernos",
            complete: "Espaço Completo",
            cardio: "Treino Completo",
            class: "Aulas Gratuitas",
            instructor: "Com Instrutor",
            explore: "Explore a Cidade",
            tour: "Passeios Guiados",
            massage: "Ambiente Relaxante",
            wellness: "Tranquilidade",
            comfort: "Conforto",
            renewal: "Renovação"
        }
      },
      contactReception: {
        text: "Para mais informações sobre nossos serviços, entre em contato com o setor de reservas ou recepção",
        button: "Falar com a Recepção"
      },
      locationPrivileged: {
        title: "Localização Privilegiada",
        near: "A poucos passos",
        nearDescription: "Ponte dos Ingleses, Centro Dragão do Mar, Mercado dos Pinhões",
        seaFront: "Frente ao mar",
        seaFrontDescription: "Vista privilegiada para o nascer do sol"
      }
    },
    // Página ESG
    esg: {
      hero: {
        title: "Compromisso com o Futuro",
        subtitle: "Sustentabilidade, inclusão e responsabilidade social no coração de nossas ações",
        badge: "ESG & Sustentabilidade",
        imageAlt: "Hotel Sustentável - Sonata de Iracema"
      },
      practices: {
        title: "Nossas Práticas em Ação",
        subtitle: "Veja como implementamos sustentabilidade em cada detalhe do hotel"
      },
      gallery: {
        solar: { title: "Painéis Solares", alt: "Energia Solar" },
        green: { title: "Preservação Ambiental", alt: "Áreas Verdes" },
        local: { title: "Produção Local", alt: "Produtos Locais" },
        food: { title: "Ingredientes Orgânicos", alt: "Alimentação Sustentável" },
        water: { title: "Economia Hídrica", alt: "Gestão de Água" },
        transport: { title: "Mobilidade Verde", alt: "Transporte Sustentável" }
      },
      actions: {
        waste: {
          title: "Gestão de Resíduos",
          description: "Coleta seletiva e reciclagem de 80% dos resíduos gerados",
          items: ["Programa de reciclagem completo", "Compostagem de resíduos orgânicos", "Redução de plásticos descartáveis", "Parceria com cooperativas locais"]
        },
        water: {
          title: "Economia de Água",
          description: "Sistemas inteligentes de reuso e economia hídrica",
          items: ["Reaproveitamento de água da chuva", "Torneiras e chuveiros econômicos", "Tratamento de água", "Programa de conscientização"]
        },
        energy: {
          title: "Energia Limpa",
          description: "Redução de 40% no consumo energético com tecnologia sustentável",
          items: ["Painéis solares para aquecimento", "Iluminação LED em 100% do hotel", "Ar-condicionado eficiente", "Sensores de presença"]
        },
        local: {
          title: "Produtos Locais",
          description: "Valorização da economia local e redução de pegada de carbono",
          items: ["90% dos alimentos são locais", "Parcerias com produtores regionais", "Produtos de limpeza ecológicos", "Amenities biodegradáveis"]
        }
      },
      inclusionActions: {
        accessibility: {
          title: "Acessibilidade",
          description: "Infraestrutura adaptada para todos",
          items: ["Quartos adaptados para PCDs", "Rampas de acesso", "Banheiros acessíveis", "Equipe treinada em Libras"]
        },
        diversity: {
          title: "Diversidade",
          description: "Ambiente inclusivo e respeitoso para todos",
          items: ["Política de não discriminação", "Equipe diversa e treinada", "Safe space certificado", "Respeito a todas as identidades"]
        }
      },
      impactPhotoStory: {
        localProd: {
          title: "Valorização da Produção Local",
          description: "90% dos nossos alimentos vêm de produtores locais. Apoiamos a economia regional e reduzimos nossa pegada de carbono com transporte local."
        },
        mobility: {
          title: "Mobilidade Sustentável",
          description: "Incentivamos o turismo sustentável com bicicletas gratuitas para explorar Fortaleza de forma ecológica e saudável."
        },
        resources: {
          title: "Gestão Inteligente de Recursos",
          description: "Sistema de reaproveitamento de água, iluminação LED 100%, painéis solares e sensores de presença para economia energética."
        },
        team: {
          title: "Equipe Local e Diversa",
          description: "95% dos nossos colaboradores são da região. Valorizamos a diversidade, inclusão e oferecemos treinamento contínuo."
        }
      },
      sustainability: {
        title: "Sustentabilidade Ambiental",
        subtitle: "Ações concretas para reduzir nosso impacto no planeta"
      },
      inclusion: {
        title: "Inclusão e Diversidade",
        subtitle: "Um espaço acolhedor e respeitoso para todas as pessoas"
      },
      commitment: {
        title: "Nosso Compromisso com o Futuro",
        subtitle: "Pequenas ações, grande impacto positivo"
      },
      social: {
        title: "Compromisso Social",
        description: "Acreditamos que um hotel não existe isolado da comunidade. Por isso, mantemos parcerias e ações que fortalecem a economia local e apoiam projetos sociais em Fortaleza.",
        together: "Juntos pela Comunidade",
        togetherSubtitle: "Parcerias e ações que fortalecem Fortaleza",
        support: {
          title: "Apoio a Artistas Locais",
          description: "Exposição e venda de obras de artistas cearenses no hotel"
        },
        jobs: {
          title: "Empregos Locais",
          description: "95% da nossa equipe é formada por profissionais da região"
        },
        suppliers: {
          title: "Fornecedores Regionais",
          description: "Prioridade para produtos e serviços de empresas locais"
        }
      },
      certifications: {
        title: "Reconhecimentos e Certificações",
        subtitle: "Nosso compromisso é reconhecido por organizações nacionais e internacionais"
      },
      cta: {
        title: "Hospede-se com Propósito",
        subtitle: "Ao escolher o Hotel Sonata, você apoia práticas sustentáveis e responsáveis",
        button: "Fazer Reserva"
      }
    },
    // Página Eventos
    events: {
      hero: {
        title: "Faça seu Evento Corporativo Conosco",
        subtitle: "Com um complexo que une espaço para eventos e hospedagem, possuímos uma das maiores capacidades em sala dentro de hotel",
        badge: "8 Salas Disponíveis"
      },
      gallery: {
        badge: "Nossos Espaços",
        title: "Ambientes Versáteis para Seu Evento",
        subtitle: "8 salas exclusivas em andares dedicados, com iluminação natural e ar-condicionado independente",
        items: {
          main: { title: "Sala Principal", alt: "Sala de Eventos Principal" },
          corporate: { title: "Setup Auditório", alt: "Espaço Corporativo" },
          meeting: { title: "Reuniões Executivas", alt: "Sala de Reuniões" },
          coffee: { title: "Coffee Break", alt: "Espaço para Coffee Break" },
          outdoor: { title: "Eventos ao Ar Livre", alt: "Área Externa para Eventos" },
          pool: { title: "Eventos Vista Mar", alt: "Espaço Piscina para Eventos" }
        }
      },
      facilities: {
        title: "Estrutura Completa para Seu Evento",
        subtitle: "São 8 salas em andares exclusivos com toda infraestrutura necessária para o sucesso do seu evento",
        items: {
          naturalLight: { title: "Iluminação Natural", description: "Todas as salas com iluminação natural" },
          ac: { title: "Ar-Condicionado Independente", description: "Sistema independente por sala" },
          exclusive: { title: "8 Salas Exclusivas", description: "Em andares dedicados a eventos" },
          parking: { title: "Estacionamento", description: "Ao lado do hotel, fácil acesso" },
          foyer: { title: "Foyer e Espaços", description: "Áreas ao ar livre e foyer" },
          gastronomy: { title: "Gastronomia Própria", description: "Ampla opção de cardápios" }
        }
      },
      capacity: {
        badge: "8 Salas Disponíveis",
        title: "Capacidades por Configuração",
        subtitle: "Compare rapidamente todas as salas e escolha a configuração ideal para o seu evento. Todas com ar-condicionado independente e iluminação natural.",
        note: "* As capacidades podem variar de acordo com a configuração escolhida e necessidades específicas do evento"
      },
      configurations: {
        title: "Configurações para Cada Ocasião",
        subtitle: "Adaptamos o espaço às necessidades do seu evento: auditório, escolar, coquetel ou banquete",
        items: {
          auditorium: { title: "Formato Auditório", description: "Ideal para palestras, workshops e apresentações (até 100 pessoas)" },
          school: { title: "Formato Escolar", description: "Perfeito para treinamentos e cursos (até 60 pessoas)" },
          banquet: { title: "Formato Banquete", description: "Casamentos e jantares especiais (até 80 pessoas)" },
          cocktail: { title: "Formato Coquetel", description: "Networking e confraternizações (até 150 pessoas)" }
        }
      },
      layout: {
        badge: "Layout Completo",
        title: "Planta do Espaço de Eventos",
        subtitle: "Visão geral da distribuição das nossas 8 salas em andares exclusivos",
        note: "* A planta é ilustrativa. Configurações podem ser adaptadas conforme necessidade do evento",
        button: "Solicitar Orçamento Personalizado"
      },
      types: {
        title: "Eventos para Todas as Ocasiões",
        subtitle: "Estrutura completa e equipe especializada para realizar seu evento dos sonhos",
        items: {
          corporate: {
            title: "Eventos Corporativos",
            description: "Reuniões, treinamentos, workshops e convenções com toda estrutura necessária.",
            capacity: "Até 100 pessoas",
            features: ["Wi-Fi de alta velocidade", "Projetor e telão", "Sistema de som", "Coffee break incluso", "Estacionamento"]
          },
          wedding: {
            title: "Casamentos",
            description: "O cenário perfeito para o dia mais especial da sua vida, com vista para o mar.",
            capacity: "Até 150 pessoas",
            features: ["Cerimônia frente ao mar", "Recepção personalizada", "Decoração exclusiva", "Menu customizado", "Suíte para noivos"]
          },
          anniversary: {
            title: "Bodas e Aniversários",
            description: "Celebre momentos especiais com elegância e sofisticação.",
            capacity: "Até 80 pessoas",
            features: ["Espaços versáteis", "Cardápio personalizado", "Decoração inclusa", "Equipe dedicada", "Vista para o mar"]
          },
          social: {
            title: "Eventos Sociais",
            description: "Confraternizações, formaturas e celebrações diversas.",
            capacity: "Até 120 pessoas",
            features: ["Ambientes flexíveis", "Catering completo", "Bar incluso", "DJ e sonorização", "Iluminação especial"]
          }
        }
      },
      form: {
        title: "Solicite um Orçamento",
        subtitle: "Preencha o formulário e nossa equipe entrará em contato em até 24 horas",
        fields: {
          name: "Nome Completo *",
          email: "Email Corporativo *",
          phone: "Telefone/WhatsApp *",
          company: "Empresa",
          eventType: "Tipo de Evento *",
          date: "Data Prevista *",
          guests: "Número de Convidados *",
          message: "Mensagem"
        },
        eventTypes: {
          corporate: "Evento Corporativo",
          wedding: "Casamento",
          anniversary: "Bodas/Aniversário",
          social: "Evento Social",
          other: "Outro"
        },
        button: "Solicitar Orçamento",
        privacy: "Ao enviar este formulário, você concorda com nossa política de privacidade"
      },
      cta: {
        title: "Atendimento Personalizado",
        subtitle: "Prefere falar diretamente com nossa equipe de eventos?",
        call: "Ligar Agora",
        whatsapp: "WhatsApp"
      },
      access: {
        title: "Acesso e Localização",
        items: ["Fácil acesso pelas escadas e elevadores", "Primeiro e segundo nível do hotel", "Estacionamento ao lado"]
      },
      included: {
        title: "Serviços Inclusos",
        items: ["Gastronomia própria com ampla opção de cardápios", "Equipe exclusiva de eventos", "Espaços ao ar livre disponíveis"]
      }
    },
    // Página Hotel
    hotel: {
      hero: {
        badge: "20 Anos de História",
        title: "Sua Casa em Fortaleza",
        subtitle: "A tradição de acolher, o prazer de se renovar"
      },
      history: {
        title: "Nossa História",
        paragraph1: "Em 2005, a Família Bezerra realizou o sonho de criar um hotel que fosse mais que hospedagem: um verdadeiro lar para quem visita Fortaleza.",
        paragraph2: "Com localização privilegiada na icônica Praia de Iracema, o Hotel Sonata nasceu com um diferencial único: todos os quartos com vista para o mar, sem exceção. Uma promessa que mantemos há 20 anos.",
        paragraph3: "Ao longo destas duas décadas, acolhemos milhares de hóspedes de todas as partes do mundo, sempre mantendo a essência do acolhimento familiar e a busca constante pela excelência no atendimento.",
        paragraph4: "Hoje, celebramos não apenas 20 anos de operação, mas duas décadas de histórias, sorrisos, reencontros e memórias criadas junto com nossos hóspedes."
      },
      journey: {
        title: "Nossa Jornada",
        subtitle: "Duas décadas de evolução, sempre mantendo nossa essência"
      },
      timeline: {
        start: {
          title: "O Início",
          description: "Abertura do Hotel Sonata de Iracema pela Família Bezerra"
        },
        expansion: {
          title: "Primeira Expansão",
          description: "Ampliação com novos quartos e área de lazer"
        },
        renovation: {
          title: "Renovação Total",
          description: "Modernização completa das instalações"
        },
        sustainability: {
          title: "Sustentabilidade",
          description: "Implementação de práticas sustentáveis e ESG"
        },
        anniversary: {
          title: "20 Anos",
          description: "Celebrando duas décadas de hospitalidade"
        }
      },
      differentialsSection: {
        title: "O Que Nos Torna Únicos",
        subtitle: "Diferenciais que fazem do Sonata sua melhor escolha em Fortaleza"
      },
      differentials: {
        seaView: {
          title: "100% Vista Mar",
          description: "Todos os quartos com vista privilegiada para o mar. Sem exceção."
        },
        location: {
          title: "Localização Única",
          description: "Coração da Praia de Iracema, centro cultural de Fortaleza."
        },
        family: {
          title: "Atendimento Familiar",
          description: "Gestão familiar que garante acolhimento genuíno."
        },
        breakfast: {
          title: "Café Premiado",
          description: "Café da manhã reconhecido pelos hóspedes e crítica."
        }
      },
      family: {
        title: "Gestão Familiar",
        imageAlt: "Família Bezerra",
        paragraph1: "O Hotel Sonata de Iracema é orgulhosamente um hotel de gestão familiar. A Família Bezerra está presente no dia a dia do hotel, garantindo que cada hóspede receba o atendimento personalizado e acolhedor que se espera de uma verdadeira casa.",
        paragraph2: "Essa proximidade com nossos hóspedes nos permite entender e antecipar necessidades, criar laços duradouros e transformar estadias em experiências memoráveis."
      },
      cta: {
        title: "Seja Parte da Nossa História",
        subtitle: "Venha conhecer o hotel que há 20 anos faz de Fortaleza um destino ainda mais especial",
        button: "Fazer Reserva"
      },
      bikes: {
        message: "Use nossas bicicletas gratuitas para explorar a orla e conhecer Fortaleza de forma sustentável"
      },
      gallery: {
        title: "Conheça Nossas Instalações",
        subtitle: "Explore cada detalhe do nosso hotel através de imagens que capturam a essência do conforto e hospitalidade",
        items: {
            pool: "Piscina Vista Mar",
            leisure: "Área de Lazer",
            relax: "Relaxamento",
            comfort: "Conforto e Lazer",
            outdoor: "Espaço ao Ar Livre",
            view: "Vista do Hotel",
            restaurant: "Nosso Restaurante",
            fitness: "Espaço Fitness",
            spa: "Área de Relaxamento"
        }
      },
      explore: {
        title: "Explore Fortaleza",
        subtitle: "Descubra os encantos da capital cearense a partir do nosso hotel",
        spots: {
            beach: { title: "Praia de Iracema", description: "Praia urbana famosa pelo pôr do sol, vida noturna e a icônica Ponte dos Ingleses. História e modernidade se encontram.", badge: "Em frente ao hotel" },
            culture: { title: "Centro Dragão do Mar", description: "Complexo cultural com museus, cinema, teatro, planetário e gastronomia. Coração cultural de Fortaleza.", badge: "10 min a pé" },
            market: { title: "Mercado dos Pinhões", description: "Artesanato cearense, renda de bilro, cerâmica e produtos regionais. Cultura e tradição local autêntica.", badge: "5 min a pé" }
        }
      },
    },
    // Seção de Acomodações
    accommodations: {
      title: "Conheça as Nossas Acomodações",
      subtitle: "117 apartamentos disponíveis, todos com vista para a praia. Acorde com o sol e a imensidão do mar, e assista ao espetáculo do nosso pôr do sol. Uma vista única na cidade de Fortaleza.",
      cards: {
        seaView: {
          title: "100% Vista Mar",
          description: "Todos os nossos 117 apartamentos têm vista privilegiada para o mar"
        },
        comfort: {
          title: "Conforto Completo",
          description: "Apartamentos equipados para sua máxima comodidade e bem-estar"
        },
        petFriendly: {
          title: "Pet Friendly",
          description: "Recebemos pets de até 10kg com toda estrutura necessária"
        }
      },
      petFriendly: {
        title: "Somos Pet Friendly!",
        subtitle: "Sabemos que nossos pets fazem parte da família",
        weOffer: "O que oferecemos:",
        offer1: "Caminha confortável para usar no quarto",
        offer2: "Potinhos para água e comida",
        offer3: "Ambiente acolhedor para pets de até 10kg",
        important: "Informações importantes:",
        rule1: "Pets devem ficar próximos aos tutores (no colo ou caixa de transporte)",
        rule2: "Evitar permanência na área do restaurante",
        fee: "Taxa de <strong class=\"text-foreground\">R$ 70 por diária</strong> pet"
      },
      button: "Ver Todos os Apartamentos"
    },
    // Serviços de Lazer
    leisureServices: {
      title: "Nossas Opções de Lazer & Bem-Estar",
      subtitle: "Temos opções para você desfrutar de momentos de bem-estar e alegria no nosso Hotel",
      pool: {
        title: "Área de Piscina",
        description: "Cadeiras de sol, chuveirão e vista para o mar. Você também pode contar com o atendimento do nosso restaurante nessa área, para aproveitar uma água de coco gelada, sucos e outras bebidas e petiscos.",
        schedule: "6:00 às 20:00 hrs",
        badge: "Vista Mar",
        tags: ["Restaurante", "Água de Coco", "Relaxamento"]
      },
      fitness: {
        title: "Espaço Fitness",
        description: "Ambiente reservado, climatizado e com vista para o mar para você se exercitar, como preferir. Equipamentos modernos em um espaço projetado para o seu bem-estar.",
        schedule: "6:00 às 22:00 hrs",
        badge: "Climatizado",
        tags: ["Vista Mar", "Equipamentos Modernos", "Climatizado"]
      },
      bikes: {
        title: "Disponibilização de Bicicletas",
        description: "Serviço gratuito para que os nossos hóspedes desfrutem de passeios e conheçam a cidade da melhor forma, com a brisa do mar e muita diversão.",
        badge: "Gratuito",
        tags: ["Passeio", "Orla", "Sustentável"]
      },
      beachTennis: {
        title: "Aulas de Beach Tennis",
        description: "Sua estada ganha ainda mais energia e diversão. Nossos hóspedes têm acesso gratuito a aulas de beach tennis, com professor especializado, material incluso e uma vista deslumbrante: o mar de Fortaleza bem à frente.",
        badge: "Gratuito",
        tags: ["Professor Especializado", "Material Incluso", "Vista Mar"]
      },
      massage: {
        title: "Sessões de Massagem",
        description: "Relaxe e renove suas energias com nossas sessões de massagem com horário marcado. Um momento de puro bem-estar durante sua estadia.",
        badge: "Com Agendamento",
        tags: ["Relaxamento", "Bem-estar", "Terapêutico"]
      },
      footer: {
        text: "Para mais informações sobre nossos serviços, entre em contato com o setor de reservas ou recepção",
        exploreButton: "Explorar Todas as Experiências",
        contactButton: "Falar com a Recepção"
      }
    },
    // Seção de Prêmios
    awards: {
      badge: "Reconhecimentos",
      titleHighlight: "Suas experiências",
      titleRest: "nos impulsionam",
      subtitle: "Certificações e prêmios que comprovam nossa qualidade e compromisso com a excelência",
      tripadvisor: {
        excellent: "Excelente",
        location: "Localização",
        walkable: "Ótimo para pedestres",
        score: "Nota: 99 de 100"
      },
      excellenceAwards: "Prêmios de Excelência",
      otherCertifications: "Outras Certificações"
    },
    // Página Contato
    contact: {
      hero: {
        title: "Entre em Contato",
        subtitle: "Estamos prontos para atender você e tornar sua estadia inesquecível",
        badge: "Atendimento 24h"
      },
      team: {
        title: "Nossa Equipe Aguarda Você",
        subtitle: "Atendimento humanizado e personalizado para tornar sua experiência única",
        reception: {
          title: "Recepção 24h",
          description: "Sempre prontos para atender"
        },
        gastronomy: {
          title: "Gastronomia",
          description: "Sabores preparados com carinho"
        },
        leisure: {
          title: "Lazer & Eventos",
          description: "Cuidando de cada detalhe"
        },
        images: {
          receptionAlt: "Recepção do Hotel",
          gastronomyAlt: "Equipe do Restaurante",
          leisureAlt: "Equipe de Lazer"
        },
        message: "Nossa equipe é formada por profissionais apaixonados pela hospitalidade",
        local: "95% dos colaboradores são da região de Fortaleza"
      },
      form: {
        title: "Envie sua Mensagem",
        fields: {
          name: "Nome Completo *",
          email: "Email *",
          phone: "Telefone/WhatsApp *",
          subject: "Assunto *",
          message: "Mensagem *"
        },
        placeholders: {
          name: "Seu nome",
          email: "seu@email.com",
          phone: "(85) 9 9999-9999",
          subject: "Sobre o que você quer falar?",
          message: "Escreva sua mensagem aqui..."
        },
        button: "Enviar Mensagem",
        response: "Responderemos em até 24 horas úteis"
      },
      info: {
        title: "Informações de Contato",
        subtitle: "Fale conosco pelos canais abaixo ou visite-nos pessoalmente",
        address: "Endereço",
        phone: "Telefone",
        whatsapp: "WhatsApp",
        email: "Email",
        hours: "Horário de Atendimento",
        reception: "Recepção: 24 horas",
        commercial: "Atendimento comercial: 8h às 18h",
        social: "Redes Sociais"
      },
      location: {
        title: "Localização Privilegiada",
        subtitle: "Em frente à Praia de Iracema, próximo aos principais pontos turísticos de Fortaleza",
        ponte: "Ponte dos Ingleses",
        dragao: "Centro Dragão do Mar",
        airport: "Aeroporto de Fortaleza",
        ponteDistance: "5 minutos a pé",
        dragaoDistance: "10 minutos a pé",
        airportDistance: "15 minutos de carro"
      },
      locationGallery: {
        items: {
          front: { title: "Frente ao Mar", alt: "Vista do Hotel" },
          facade: { title: "Fácil Acesso", alt: "Fachada do Hotel" },
          external: { title: "Entrada Principal", alt: "Área Externa" },
          reception: { title: "Recepção Acolhedora", alt: "Recepção" }
        }
      },
      gallery: {
        title: "Localização Privilegiada",
        subtitle: "Em frente à Praia de Iracema, próximo aos principais pontos turísticos de Fortaleza"
      }
    },
    // Página Home - Localização
    home: {
      experiences: {
        title: "Experiências Inesquecíveis",
        subtitle: "Descubra cada momento especial que preparamos para você em frente à Praia de Iracema",
        cards: {
          pool: {
            title: "Piscina Vista Mar",
            description: "Relaxe em nossa piscina com vista privilegiada para o oceano Atlântico. Espreguiçadeiras, chuveirão e atendimento do restaurante.",
            badge: "Vista Panorâmica",
            cta: "Explorar Lazer"
          },
          gastronomy: {
            title: "Gastronomia Regional",
            description: "Saboreie o melhor da culinária cearense com café da manhã regional premiado e restaurante com frutos do mar frescos.",
            badge: "Café Premiado",
            cta: "Ver Cardápio"
          },
          rooms: {
            title: "Quartos com Vista",
            description: "Acomodações elegantes com vista para o mar, camas premium e amenities de qualidade para seu máximo conforto.",
            badge: "Conforto Premium",
            cta: "Ver Quartos"
          },
          spa: {
            title: "Spa & Relaxamento",
            description: "Sessões de massagem, espaço fitness climatizado e área de bem-estar para renovar suas energias.",
            badge: "Bem-Estar",
            cta: "Agendar Massagem"
          },
          beachTennis: {
            title: "Beach Tennis Gratuito",
            description: "Aulas gratuitas de beach tennis com professor especializado, material incluso e vista para o mar.",
            badge: "Incluso",
            cta: "Saber Mais"
          },
          sustainability: {
            title: "Pet Friendly",
            description: "Seu melhor amigo é bem-vindo! Ambiente acolhedor para você e seu pet, com áreas específicas e cuidados especiais.",
            badge: "Pet Friendly",
            cta: "Saber Mais"
          }
        }
      },
      photoStory: {
        title: "Um Dia no Hotel Sonata",
        subtitle: "Da alvorada ao pôr do sol, cada momento é especial em frente à Praia de Iracema",
        items: {
          sunrise: {
            title: "Nascer do Sol na Piscina",
            description: "Comece o dia com vista privilegiada para o amanhecer sobre o oceano Atlântico. Nossa piscina abre às 6h para os huéspedes que amam aproveitar a tranquilidade da manhã.",
            time: "6:00"
          },
          breakfast: {
            title: "Café da Manhã Regional",
            description: "Buffet completo com tapiocas feitas na hora, frutas tropicais frescas, pães artesanais e o melhor café regional. Tudo com vista para o mar.",
            time: "7:00 - 10:00"
          },
          bike: {
            title: "Passeio de Bike pela Orla",
            description: "Bicicletas gratuitas para explorar a orla de Fortaleza. Visite a Ponte dos Ingleses, Centro Dragão do Mar e outros pontos turísticos.",
            time: "9:00"
          },
          beachTennis: {
            title: "Beach Tennis na Praia",
            description: "Aulas gratuitas com professor especializado. Material incluso, apenas o sol e o mar de Fortaleza como cenário.",
            time: "10:00"
          },
          lunch: {
            title: "Almoço com Frutos do Mar",
            description: "Restaurante com especialidades em frutos do mar frescos e culinária cearense. Pratos que celebram os sabores locais.",
            time: "12:00 - 15:00"
          },
          spa: {
            title: "Relaxamento no Spa",
            description: "Sessões de massagem com agendamento. Um momento de puro bem-estar e renovação de energias durante sua estadia.",
            time: "15:00"
          },
          poolAfternoon: {
            title: "Tarde na Piscina",
            description: "Aproveite o sol da tarde com água de coco gelada, música ambiente e a brisa do mar. Nosso bar serve drinks e petiscos.",
            time: "16:00"
          },
          sunset: {
            title: "Pôr do Sol Inesquecível",
            description: "O momento mais aguardado do dia. Assista ao pôr do sol com cores incríveis refletindo no mar de Iracema.",
            time: "17:30"
          }
        }
      },
      gallery: {
        title: "Momentos Inesquecíveis",
        subtitle: "Cada canto do Hotel Sonata foi pensado para criar memórias especiais",
        items: {
          poolArea: { alt: "Área da Piscina", title: "Área de Lazer" },
          poolView: { alt: "Vista da Piscina", title: "Vista Panorâmica" },
          breakfast: { alt: "Café da Manhã", title: "Café Regional" },
          gym: { alt: "Academia", title: "Espaço Fitness" },
          panoramicView: { alt: "Vista Panorâmica", title: "Vista do Hotel" },
          goldenHour: { alt: "Piscina ao Entardecer", title: "Golden Hour" },
          spa: { alt: "Espaço de Relaxamento", title: "Spa" },
          bikes: { alt: "Bicicletas", title: "Explore a Cidade" },
          restaurant: { alt: "Restaurante", title: "Experiência Gastronômica" }
        }
      },
      location: {
        subtitle: "Localização privilegiada no coração de Fortaleza, com acesso direto à praia e próximo aos principais pontos turísticos",
        spots: {
          iracema: {
            name: "Praia de Iracema",
            distance: "Em frente ao hotel"
          },
          ponte: {
            name: "Ponte dos Ingleses",
            distance: "5 minutos a pé"
          },
          dragao: {
            name: "Centro Dragão do Mar",
            distance: "10 minutos a pé"
          },
          orla: {
            name: "Orla de Fortaleza",
            distance: "Explore de bike"
          }
        },
        highlight: {
          title: "O Melhor de Fortaleza na Sua Porta",
          items: {
            beach: {
              title: "Praia de Iracema",
              description: "Vista privilegiada, nascer do sol espetacular e vida noturna vibrante"
            },
            culture: {
              title: "Cultura & Arte",
              description: "Centro Dragão do Mar, museus, teatro e gastronomia regional"
            },
            mobility: {
              title: "Mobilidade",
              description: "Bicicletas gratuitas para explorar a orla e pontos turísticos"
            }
          }
        }
      }
    },
    // Footer
    footer: {
      description: "Sua casa em Fortaleza. A tradição de acolher, o prazer de se renovar.",
      quickMenu: "Menu Rápido",
      contact: "Contato",
      address: "Praia de Iracema, Fortaleza - CE",
      copyright: "Todos os direitos reservados.",
      credibility: {
        title: "Certificações",
        trust: "Hotel Certificado e Seguro"
      }
    }
  },
  es: {
    // Página de Quartos
    rooms: {
      hero: {
        title: "Habitaciones con Vista al Mar",
        subtitle: "Todas nuestras habitaciones ofrecen vista privilegiada al mar. Despierta con el sol naciendo sobre las aguas de la Playa de Iracema."
      },
      section: {
        title: "Elige Tu Alojamiento",
        subtitle: "Comodidad, sofisticación y la vista más hermosa de Fortaleza"
      },
      empty: "No hay habitaciones disponibles en este momento.",
      cta: {
        title: "¿Listo para Tu Experiencia?",
        subtitle: "Reserva ahora y garantiza las mejores tarifas y condiciones especiales",
        bookNow: "Reservar Ahora",
        contact: "Contáctanos"
      },
      highlights: {
        comfort: { title: "Confort Premium", description: "Camas cómodas y ropa de cama de alta calidad" },
        view: { title: "Vista al Mar", description: "Habitaciones con vista privilegiada a la Playa de Iracema" },
        ac: { title: "Aire Acondicionado", description: "Climatización individual en todas las habitaciones" }
      },
      gallery: {
        title: "Despierta con Vista al Mar",
        subtitle: "Habitaciones elegantes y confortables con vistas privilegiadas de la Playa de Iracema",
        items: {
            suite: "Suite Premium",
            standard: "Elegancia",
            reception: "Atención 24h",
            common: "Áreas Comunes",
            pool: "Vista de la Piscina"
        }
      },
      photoStory: {
        title: "Detalles que Hacen la Diferencia",
        subtitle: "Cada elemento fue pensado para proporcionar máximo confort y bienestar",
        items: {
            beds: { title: "Camas Premium", description: "Colchones de alta calidad con ropa de cama premium. Almohadas suaves y edredones acogedores para garantizar noches de sueño perfectas." },
            view: { title: "Vista Deslumbrante", description: "Despierta todos los días con vista al océano Atlántico. Habitaciones estratégicamente posicionadas para aprovechar el amanecer." },
            modern: { title: "Ambientes Modernos", description: "Diseño contemporáneo con toques locales. Aire acondicionado individual, TV smart, frigobar y amenities de calidad." },
            shared: { title: "Espacios Compartidos", description: "Además del confort de la habitación, disfruta de áreas comunes como piscina, terraza y jardines para momentos de ocio." }
        }
      }
    },
    // Página de Gastronomia
    gastronomy: {
      hero: {
        title: "Gastronomía que Encanta",
        subtitle: "Sabores auténticos, ingredientes locales y la mejor vista de Fortaleza"
      },
      breakfast: {
        badge: "Premiado",
        title: "Desayuno Premiado",
        description: "Comienza tu día con un desayuno inolvidable. Nuestra selección especial incluye frutas tropicales frescas, panes artesanales, tapiocas preparadas al momento y el mejor café regional.",
        scheduleTitle: "Horario",
        scheduleWeekday: "Lunes a Viernes: 6h30 a 10h",
        scheduleWeekend: "Sábados y Domingos: 7h a 10h30",
        highlightsTitle: "Destacados"
      },
      restaurant: {
        title: "Restaurante",
        description: "Disfruta de platos que celebran la rica cocina cearense, preparados con ingredientes frescos y locales. Nuestra cocina combina tradición e innovación para crear experiencias gastronómicas memorables.",
        scheduleTitle: "Horario de Funcionamiento",
        lunch: "Almuerzo: 12h a 15h",
        dinner: "Cena: 18h30 a 22h",
        ourKitchen: "Nuestra Cocina"
      },
      roomService: {
        title: "Servicio de Habitación",
        description: "Disfruta de nuestras delicias en la comodidad de tu habitación. Servicio disponible 24 horas para tu comodidad.",
        available: "Disponible 24 horas"
      },
      cta: {
        title: "Reserva y Saborea",
        subtitle: "Desayuno incluido en todas las reservas. ¡Ven a probar!",
        bookNow: "Hacer Reserva"
      },
      highlightsList: {
        tapioca: "Tapiocas y crepiocas preparadas al momento",
        fruits: "Frutas tropicales de estación",
        breads: "Panes y pasteles artesanales",
        coffee: "Café regional premiado",
        vegan: "Opciones vegetarianas y veganas",
        view: "Vista panorámica al mar"
      },
      gallery: {
        breakfast: { title: "Comienza el Día con Sabor", subtitle: "Buffet completo con delicias regionales, frutas tropicales y tapiocas hechas al momento", badge: "Desayuno Regional" },
        restaurant: { title: "Experiencia Gastronómica Completa", subtitle: "Desde el desayuno hasta la cena, cada comida es una celebración de los sabores cearenses", badge: "Nuestro Restaurante" },
        items: {
            buffet: "Buffet Completo",
            tapioca: "Tapiocas al Momento",
            fruits: "Frutas Frescas",
            breads: "Panes y Pasteles Caseros",
            juices: "Jugos y Vitaminas",
            coffee: "Café Cearense",
            environment: "Ambiente Sofisticado",
            table: "Vista al Mar",
            dishes: "Alta Gastronomía",
            ocean: "Del Océano para Ti",
            flavor: "Sabores de Ceará",
            moment: "Momentos Especiales"
        }
      },
      photoStory: {
        title: "Del Mar a Tu Mesa",
        subtitle: "Una jornada gastronómica por los sabores de Ceará",
        items: {
            restaurant: { title: "Restaurante con Vista", description: "Ambiente elegante y acogedor con vista al mar. El escenario perfecto para tus comidas, sea un almuerzo ejecutivo o una cena romántica." },
            seafood: { title: "Mariscos Frescos", description: "Trabajamos solo con mariscos frescos, directo de los pescadores locales. Langosta, camarón, pescado y otras delicias del océano preparados con maestría." },
            chef: { title: "Especial del Chef", description: "Nuestro chef crea platos exclusivos que mezclan técnicas contemporáneas con los sabores tradicionales de la cocina cearense." },
            breakfast: { title: "Desayuno Premiado", description: "Reconocido por los huéspedes como uno de los mejores desayunos de Fortaleza. Variedad, calidad y vista al mar." }
        }
      }
    },
    // Página de Lazer
    leisure: {
      hero: {
        title: "Tu Verdadera Sala de Estar",
        subtitle: "La Playa de Iracema es el corazón cultural de Fortaleza. Y estás en el mejor lugar para vivirla intensamente."
      },
      section: {
        title: "Experiencias Inolvidables",
        subtitle: "Actividades y ocio para todos los momentos de tu estadía"
      },
      location: {
        badge: "Playa de Iracema",
        title: "Corazón Cultural de Fortaleza",
        description: "Ubicado en la icónica Playa de Iracema, estás a pasos de distancia de los principales puntos turísticos, restaurantes reconocidos, vida nocturna vibrante y de la cultura auténtica cearense."
      },
      cta: {
        title: "Vive la Experiencia Completa",
        subtitle: "Reserva ahora y aprovecha todas las actividades incluidas en tu estadía",
        bookNow: "Hacer Reserva"
      },
      photoStory: {
        title: "Tu Día de Ocio Completo",
        subtitle: "Actividades gratuitas y pagadas para todos los gustos",
        items: {
            gym: { title: "Gimnasio con Vista", description: "Inicia el día con ejercicios en nuestro gimnasio climatizado con vista al mar. Equipos modernos y ambiente reservado disponible de 6h a 22h.", time: "6:00 - 22:00" },
            tennis: { title: "Beach Tennis Gratuito", description: "Clases gratuitas con profesor especializado. Material incluido, solo aprovecha el sol y la diversión con vista al mar de Fortaleza.", time: "10:00" },
            bike: { title: "Paseo en Bicicleta", description: "Servicio gratuito de bicicletas para explorar la Playa de Iracema, Puente de los Ingleses y Centro Dragão do Mar. ¡Aventúrate por la ciudad!", time: "Todo el día" },
            spa: { title: "Masajes y Spa", description: "Sesiones de masaje terapéutico con cita previa. Relájate y renueva tus energías en un ambiente tranquilo y acogedor.", time: "Con cita previa" }
        }
      },
      gallery: {
        pool: { title: "Relájate Frente al Mar", subtitle: "Vista privilegiada, tumbonas cómodas y atención del restaurante en el área de la piscina", badge: "Piscina con Vista" },
        fitness: { title: "Mantén tu Rutina de Ejercicios", subtitle: "Gimnasio climatizado con equipos modernos y vista al mar", badge: "Espacio Fitness" },
        activities: { title: "Diversión para Toda la Familia", subtitle: "Beach tennis, bicicletas y mucho más incluidos en tu hospedaje", badge: "Actividades Gratuitas" },
        spa: { title: "Momentos de Puro Relax", subtitle: "Masajes terapéuticos en ambiente tranquilo y acogedor", badge: "Spa & Bienestar" },
        items: {
            view: "Vista Panorámica",
            leisure: "Área de Ocio",
            relax: "Relajación",
            golden: "Golden Hour",
            outdoor: "Espacio al Aire Libre",
            hotelView: "Vista del Hotel",
            modern: "Equipos Modernos",
            complete: "Espacio Completo",
            cardio: "Entrenamiento Completo",
            class: "Clases Gratuitas",
            instructor: "Con Instructor",
            explore: "Explora la Ciudad",
            tour: "Paseos Guiados",
            massage: "Ambiente Relajante",
            wellness: "Tranquilidad",
            comfort: "Confort",
            renewal: "Renovación"
        }
      },
      contactReception: {
        text: "Para más información sobre nuestros servicios, contacta con el departamento de reservas o recepción",
        button: "Hablar con Recepción"
      },
      locationPrivileged: {
        title: "Ubicación Privilegiada",
        near: "A pocos pasos",
        nearDescription: "Puente de los Ingleses, Centro Dragão do Mar, Mercado dos Pinhões",
        seaFront: "Frente al mar",
        seaFrontDescription: "Vista privilegiada al amanecer"
      }
    },
    // Página ESG
    esg: {
      hero: {
        title: "Compromiso con el Futuro",
        subtitle: "Sostenibilidad, inclusión y responsabilidad social en el corazón de nuestras acciones",
        badge: "ESG & Sostenibilidad",
        imageAlt: "Hotel Sostenible - Sonata de Iracema"
      },
      practices: {
        title: "Nuestras Prácticas en Acción",
        subtitle: "Ve cómo implementamos sostenibilidad en cada detalle del hotel"
      },
      gallery: {
        solar: { title: "Paneles Solares", alt: "Energía Solar" },
        green: { title: "Preservación Ambiental", alt: "Áreas Verdes" },
        local: { title: "Producción Local", alt: "Productos Locales" },
        food: { title: "Ingredientes Orgánicos", alt: "Alimentación Sostenible" },
        water: { title: "Economía Hídrica", alt: "Gestión de Agua" },
        transport: { title: "Movilidad Verde", alt: "Transporte Sostenible" }
      },
      actions: {
        waste: {
          title: "Gestión de Residuos",
          description: "Recolección selectiva y reciclaje del 80% de los residuos generados",
          items: ["Programa de reciclaje completo", "Compostaje de residuos orgánicos", "Reducción de plásticos desechables", "Alianza con cooperativas locales"]
        },
        water: {
          title: "Economía de Agua",
          description: "Sistemas inteligentes de reuso y economía hídrica",
          items: ["Reaprovechamiento de agua de lluvia", "Grifos y duchas económicos", "Tratamiento de agua", "Programa de concientización"]
        },
        energy: {
          title: "Energía Limpia",
          description: "Reducción del 40% en el consumo energético con tecnología sostenible",
          items: ["Paneles solares para calefacción", "Iluminación LED en 100% del hotel", "Aire acondicionado eficiente", "Sensores de presencia"]
        },
        local: {
          title: "Productos Locales",
          description: "Valorización de la economía local y reducción de huella de carbono",
          items: ["90% de los alimentos son locales", "Alianzas con productores regionales", "Productos de limpieza ecológicos", "Amenities biodegradables"]
        }
      },
      inclusionActions: {
        accessibility: {
          title: "Accesibilidad",
          description: "Infraestructura adaptada para todos",
          items: ["Habitaciones adaptadas para PCDs", "Rampas de acceso", "Baños accesibles", "Equipo entrenado en Libras"]
        },
        diversity: {
          title: "Diversidad",
          description: "Ambiente inclusivo y respetuoso para todos",
          items: ["Política de no discriminación", "Equipo diverso y entrenado", "Safe space certificado", "Respeto a todas las identidades"]
        }
      },
      impactPhotoStory: {
        localProd: {
          title: "Valorización de la Producción Local",
          description: "90% de nuestros alimentos vienen de productores locales. Apoyamos la economía regional y reducimos nuestra huella de carbono con transporte local."
        },
        mobility: {
          title: "Movilidad Sostenible",
          description: "Incentivamos el turismo sostenible con bicicletas gratuitas para explorar Fortaleza de forma ecológica y saludable."
        },
        resources: {
          title: "Gestión Inteligente de Recursos",
          description: "Sistema de reaprovechamiento de agua, iluminación LED 100%, paneles solares y sensores de presencia para economía energética."
        },
        team: {
          title: "Equipo Local y Diverso",
          description: "95% de nuestros colaboradores son de la región. Valoramos la diversidad, inclusión y ofrecemos entrenamiento continuo."
        }
      },
      sustainability: {
        title: "Sostenibilidad Ambiental",
        subtitle: "Acciones concretas para reducir nuestro impacto en el planeta"
      },
      inclusion: {
        title: "Inclusión y Diversidad",
        subtitle: "Un espacio acogedor y respetuoso para todas las personas"
      },
      commitment: {
        title: "Nuestro Compromiso con el Futuro",
        subtitle: "Pequeñas acciones, gran impacto positivo"
      },
      social: {
        title: "Compromiso Social",
        description: "Creemos que un hotel no existe aislado de la comunidad. Por eso, mantenemos alianzas y acciones que fortalecen la economía local y apoyan proyectos sociales en Fortaleza.",
        together: "Juntos por la Comunidad",
        togetherSubtitle: "Alianzas y acciones que fortalecen Fortaleza",
        support: {
          title: "Apoyo a Artistas Locales",
          description: "Exposición y venta de obras de artistas cearenses en el hotel"
        },
        jobs: {
          title: "Empleos Locales",
          description: "95% de nuestro equipo está formado por profesionales de la región"
        },
        suppliers: {
          title: "Proveedores Regionales",
          description: "Prioridad para productos y servicios de empresas locales"
        }
      },
      certifications: {
        title: "Reconocimientos y Certificaciones",
        subtitle: "Nuestro compromiso es reconocido por organizaciones nacionales e internacionales"
      },
      cta: {
        title: "Hospédate con Propósito",
        subtitle: "Al elegir el Hotel Sonata, apoyas prácticas sostenibles y responsables",
        button: "Hacer Reserva"
      }
    },
    // Página Eventos
    events: {
      hero: {
        title: "Haz tu Evento Corporativo con Nosotros",
        subtitle: "Con un complejo que une espacio para eventos y hospedaje, poseemos una de las mayores capacidades en sala dentro de hotel",
        badge: "8 Salas Disponibles"
      },
      gallery: {
        badge: "Nuestros Espacios",
        title: "Ambientes Versátiles para Tu Evento",
        subtitle: "8 salas exclusivas en pisos dedicados, con iluminación natural y aire acondicionado independiente",
        items: {
          main: { title: "Sala Principal", alt: "Sala de Eventos Principal" },
          corporate: { title: "Espacio Corporativo", alt: "Setup Auditório" },
          meeting: { title: "Sala de Reuniones", alt: "Reuniones Ejecutivas" },
          coffee: { title: "Espacio para Coffee Break", alt: "Coffee Break" },
          outdoor: { title: "Área Externa para Eventos", alt: "Eventos al Aire Libre" },
          pool: { title: "Espacio Piscina para Eventos", alt: "Eventos Vista Mar" }
        }
      },
      facilities: {
        title: "Estructura Completa para Tu Evento",
        subtitle: "Son 8 salas en pisos exclusivos con toda la infraestructura necesaria para el éxito de tu evento",
        items: {
          naturalLight: { title: "Iluminación Natural", description: "Todas las salas con iluminación natural" },
          ac: { title: "Aire Acondicionado Independiente", description: "Sistema independiente por sala" },
          exclusive: { title: "8 Salas Exclusivas", description: "En pisos dedicados a eventos" },
          parking: { title: "Estacionamiento", description: "Al lado del hotel, fácil acceso" },
          foyer: { title: "Foyer y Espacios", description: "Áreas al aire libre y foyer" },
          gastronomy: { title: "Gastronomía Propia", description: "Amplia opción de menús" }
        }
      },
      capacity: {
        badge: "8 Salas Disponibles",
        title: "Capacidades por Configuración",
        subtitle: "Compara rápidamente todas las salas y elige la configuración ideal para tu evento. Todas con aire acondicionado independiente e iluminación natural.",
        note: "* Las capacidades pueden variar según la configuración elegida y necesidades específicas del evento"
      },
      configurations: {
        title: "Configuraciones para Cada Ocasión",
        subtitle: "Adaptamos el espacio a las necesidades de tu evento: auditorio, escolar, cóctel o banquete",
        items: {
          auditorium: { title: "Formato Auditorio", description: "Ideal para conferencias, talleres y presentaciones (hasta 100 personas)" },
          school: { title: "Formato Escolar", description: "Perfecto para entrenamientos y cursos (hasta 60 personas)" },
          banquet: { title: "Formato Banquete", description: "Bodas y cenas especiales (hasta 80 personas)" },
          cocktail: { title: "Formato Cóctel", description: "Networking y confraternizaciones (hasta 150 personas)" }
        }
      },
      layout: {
        badge: "Layout Completo",
        title: "Planta del Espacio de Eventos",
        subtitle: "Visión general de la distribución de nuestras 8 salas en pisos exclusivos",
        note: "* La planta es ilustrativa. Las configuraciones pueden adaptarse según la necesidad del evento",
        button: "Solicitar Presupuesto Personalizado"
      },
      types: {
        title: "Eventos para Todas las Ocasiones",
        subtitle: "Estructura completa y equipo especializado para realizar tu evento soñado",
        items: {
          corporate: {
            title: "Eventos Corporativos",
            description: "Reuniones, entrenamientos, talleres y convenciones con toda la estructura necesaria.",
            capacity: "Hasta 100 personas",
            features: ["Wi-Fi de alta velocidad", "Proyector y pantalla", "Sistema de sonido", "Coffee break incluido", "Estacionamiento"]
          },
          wedding: {
            title: "Bodas",
            description: "El escenario perfecto para el día más especial de tu vida, con vista al mar.",
            capacity: "Hasta 150 personas",
            features: ["Ceremonia frente al mar", "Recepción personalizada", "Decoración exclusiva", "Menú personalizado", "Suite para novios"]
          },
          anniversary: {
            title: "Bodas y Cumpleaños",
            description: "Celebra momentos especiales con elegancia y sofisticación.",
            capacity: "Hasta 80 personas",
            features: ["Espacios versátiles", "Menú personalizado", "Decoración incluida", "Equipo dedicado", "Vista al mar"]
          },
          social: {
            title: "Eventos Sociales",
            description: "Confraternizaciones, graduaciones y celebraciones diversas.",
            capacity: "Hasta 120 personas",
            features: ["Ambientes flexibles", "Catering completo", "Bar incluido", "DJ y sonorización", "Iluminación especial"]
          }
        }
      },
      form: {
        title: "Solicita un Presupuesto",
        subtitle: "Completa el formulario y nuestro equipo te contactará en hasta 24 horas",
        fields: {
          name: "Nombre Completo *",
          email: "Email Corporativo *",
          phone: "Teléfono/WhatsApp *",
          company: "Empresa",
          eventType: "Tipo de Evento *",
          date: "Fecha Prevista *",
          guests: "Número de Invitados *",
          message: "Mensaje"
        },
        eventTypes: {
          corporate: "Evento Corporativo",
          wedding: "Boda",
          anniversary: "Bodas/Aniversario",
          social: "Evento Social",
          other: "Otro"
        },
        button: "Solicitar Presupuesto",
        privacy: "Al enviar este formulario, aceptas nuestra política de privacidad"
      },
      cta: {
        title: "Atención Personalizada",
        subtitle: "¿Prefieres hablar directamente con nuestro equipo de eventos?",
        call: "Llamar Ahora",
        whatsapp: "WhatsApp"
      },
      access: {
        title: "Acceso y Ubicación",
        items: ["Fácil acceso por escaleras y ascensores", "Primer y segundo nivel del hotel", "Estacionamiento al lado"]
      },
      included: {
        title: "Servicios Incluidos",
        items: ["Gastronomía propia con amplia opción de menús", "Equipo exclusivo de eventos", "Espacios al aire libre disponibles"]
      }
    },
    // Página Hotel
    hotel: {
      hero: {
        badge: "20 Años de Historia",
        title: "Tu Casa en Fortaleza",
        subtitle: "La tradición de acoger, el placer de renovarse"
      },
      history: {
        title: "Nuestra Historia",
        paragraph1: "En 2005, la Familia Bezerra realizó el sueño de crear un hotel que fuera más que hospedaje: un verdadero hogar para quien visita Fortaleza.",
        paragraph2: "Con ubicación privilegiada en la icónica Playa de Iracema, el Hotel Sonata nació con un diferencial único: todas las habitaciones con vista al mar, sin excepción. Una promesa que mantenemos hace 20 años.",
        paragraph3: "A lo largo de estas dos décadas, acogimos miles de huéspedes de todas partes del mundo, siempre manteniendo la esencia de la acogida familiar y la búsqueda constante de la excelencia en el servicio.",
        paragraph4: "Hoy, celebramos no solo 20 años de operación, sino dos décadas de historias, sonrisas, reencuentros y memorias creadas junto con nuestros huéspedes."
      },
      journey: {
        title: "Nuestro Viaje",
        subtitle: "Dos décadas de evolución, siempre manteniendo nuestra esencia"
      },
      timeline: {
        start: {
          title: "El Comienzo",
          description: "Apertura del Hotel Sonata de Iracema por la Familia Bezerra"
        },
        expansion: {
          title: "Primera Expansión",
          description: "Ampliación con nuevas habitaciones y área de ocio"
        },
        renovation: {
          title: "Renovación Total",
          description: "Modernización completa de las instalaciones"
        },
        sustainability: {
          title: "Sostenibilidad",
          description: "Implementación de prácticas sostenibles y ESG"
        },
        anniversary: {
          title: "20 Años",
          description: "Celebrando dos décadas de hospitalidad"
        }
      },
      differentialsSection: {
        title: "Lo Que Nos Hace Únicos",
        subtitle: "Diferenciales que hacen del Sonata tu mejor elección en Fortaleza"
      },
      differentials: {
        seaView: {
          title: "100% Vista al Mar",
          description: "Todas las habitaciones con vista privilegiada al mar. Sin excepción."
        },
        location: {
          title: "Ubicación Única",
          description: "Corazón de la Playa de Iracema, centro cultural de Fortaleza."
        },
        family: {
          title: "Atención Familiar",
          description: "Gestión familiar que garantiza acogida genuina."
        },
        breakfast: {
          title: "Desayuno Premiado",
          description: "Desayuno reconocido por los huéspedes y la crítica."
        }
      },
      family: {
        title: "Gestión Familiar",
        imageAlt: "Familia Bezerra",
        paragraph1: "El Hotel Sonata de Iracema es orgullosamente un hotel de gestión familiar. La Familia Bezerra está presente en el día a día del hotel, garantizando que cada huésped reciba la atención personalizada y acogedora que se espera de una verdadera casa.",
        paragraph2: "Esta proximidad con nuestros huéspedes nos permite entender y anticipar necesidades, crear lazos duraderos y transformar estadías en experiencias memorables."
      },
      cta: {
        title: "Sé Parte de Nuestra Historia",
        subtitle: "Ven a conocer el hotel que hace 20 años hace de Fortaleza un destino aún más especial",
        button: "Hacer Reserva"
      },
      bikes: {
        message: "Usa nuestras bicicletas gratuitas para explorar la orla y conocer Fortaleza de forma sostenible"
      },
      gallery: {
        title: "Conoce Nuestras Instalaciones",
        subtitle: "Explora cada detalle de nuestro hotel a través de imágenes que capturan la esencia del confort y hospitalidad",
        items: {
            pool: "Piscina Vista Mar",
            leisure: "Área de Ocio",
            relax: "Relajación",
            comfort: "Confort y Ocio",
            outdoor: "Espacio al Aire Libre",
            view: "Vista del Hotel",
            restaurant: "Nuestro Restaurante",
            fitness: "Espacio Fitness",
            spa: "Área de Relajación"
        }
      },
      explore: {
        title: "Explora Fortaleza",
        subtitle: "Descubre los encantos de la capital cearense desde nuestro hotel",
        spots: {
            beach: { title: "Playa de Iracema", description: "Playa urbana famosa por el atardecer, vida nocturna y el icónico Puente de los Ingleses. Historia y modernidad se encuentran.", badge: "Frente al hotel" },
            culture: { title: "Centro Dragão do Mar", description: "Complejo cultural con museos, cine, teatro, planetario y gastronomía. Corazón cultural de Fortaleza.", badge: "10 min a pie" },
            market: { title: "Mercado dos Pinhões", description: "Artesanía cearense, encaje de bolillos, cerámica y productos regionales. Cultura y tradición local auténtica.", badge: "5 min a pie" }
        }
      },
    },
    // Seção de Acomodações
    accommodations: {
      title: "Conoce Nuestros Alojamientos",
      subtitle: "117 apartamentos disponibles, todos con vista a la playa. Despierta con el sol y la inmensidad del mar, y asiste al espectáculo de nuestra puesta de sol. Una vista única en la ciudad de Fortaleza.",
      cards: {
        seaView: {
          title: "100% Vista al Mar",
          description: "Todos nuestros 117 apartamentos tienen vista privilegiada al mar"
        },
        comfort: {
          title: "Confort Completo",
          description: "Apartamentos equipados para tu máxima comodidad y bienestar"
        },
        petFriendly: {
          title: "Pet Friendly",
          description: "Recibimos mascotas de hasta 10kg con toda la estructura necesaria"
        }
      },
      petFriendly: {
        title: "¡Somos Pet Friendly!",
        subtitle: "Sabemos que nuestras mascotas son parte de la familia",
        weOffer: "Lo que ofrecemos:",
        offer1: "Camita cómoda para usar en la habitación",
        offer2: "Recipientes para agua y comida",
        offer3: "Ambiente acogedor para mascotas de hasta 10kg",
        important: "Informaciones importantes:",
        rule1: "Las mascotas deben permanecer cerca de sus tutores (en brazos o caja de transporte)",
        rule2: "Evitar permanencia en el área del restaurante",
        fee: "Tarifa de <strong class=\"text-foreground\">R$ 70 por diaria</strong> mascota"
      },
      button: "Ver Todos los Apartamentos"
    },
    // Serviços de Lazer
    leisureServices: {
      title: "Nuestras Opciones de Ocio & Bienestar",
      subtitle: "Tenemos opciones para que disfrutes de momentos de bienestar y alegría en nuestro Hotel",
      pool: {
        title: "Área de Piscina",
        description: "Tumbonas, ducha y vista al mar. También puedes contar con el servicio de nuestro restaurante en esta área, para disfrutar de un agua de coco fría, jugos y otras bebidas y aperitivos.",
        schedule: "6:00 a 20:00 hrs",
        badge: "Vista al Mar",
        tags: ["Restaurante", "Agua de Coco", "Relajación"]
      },
      fitness: {
        title: "Espacio Fitness",
        description: "Ambiente reservado, climatizado y con vista al mar para que te ejercites como prefieras. Equipos modernos en un espacio diseñado para tu bienestar.",
        schedule: "6:00 a 22:00 hrs",
        badge: "Climatizado",
        tags: ["Vista al Mar", "Equipos Modernos", "Climatizado"]
      },
      bikes: {
        title: "Disponibilidad de Bicicletas",
        description: "Servicio gratuito para que nuestros huéspedes disfruten de paseos y conozcan la ciudad de la mejor manera, con la brisa del mar y mucha diversión.",
        badge: "Gratuito",
        tags: ["Paseo", "Orla", "Sustentable"]
      },
      beachTennis: {
        title: "Clases de Beach Tennis",
        description: "Tu estadía gana aún más energía y diversión. Nuestros huéspedes tienen acceso gratuito a clases de beach tennis, con profesor especializado, material incluido y una vista deslumbrante: el mar de Fortaleza justo enfrente.",
        badge: "Gratuito",
        tags: ["Profesor Especializado", "Material Incluido", "Vista al Mar"]
      },
      massage: {
        title: "Sesiones de Masaje",
        description: "Relájate y renueva tus energías con nuestras sesiones de masaje con horario programado. Un momento de puro bienestar durante tu estadía.",
        badge: "Con Cita Previa",
        tags: ["Relajación", "Bienestar", "Terapéutico"]
      },
      footer: {
        text: "Para más información sobre nuestros servicios, contacta el sector de reservas o recepción",
        exploreButton: "Explorar Todas las Experiencias",
        contactButton: "Hablar con la Recepción"
      }
    },
    // Seção de Prêmios
    awards: {
      badge: "Reconocimientos",
      titleHighlight: "Tus experiencias",
      titleRest: "nos impulsan",
      subtitle: "Certificaciones y premios que comprueban nuestra calidad y compromiso con la excelencia",
      tripadvisor: {
        excellent: "Excelente",
        location: "Ubicación",
        walkable: "Excelente para peatones",
        score: "Puntuación: 99 de 100"
      },
      excellenceAwards: "Premios de Excelencia",
      otherCertifications: "Otras Certificaciones"
    },
    // Página Contato
    contact: {
      hero: {
        title: "Contáctanos",
        subtitle: "Estamos listos para atenderte y hacer tu estadía inolvidable",
        badge: "Atención 24h"
      },
      team: {
        title: "Nuestro Equipo Te Espera",
        subtitle: "Atención humanizada y personalizada para hacer tu experiencia única",
        reception: {
          title: "Recepción 24h",
          description: "Siempre listos para atender"
        },
        gastronomy: {
          title: "Gastronomía",
          description: "Sabores preparados con cariño"
        },
        leisure: {
          title: "Ocio & Eventos",
          description: "Cuidando cada detalle"
        },
        images: {
          receptionAlt: "Recepción del Hotel",
          gastronomyAlt: "Equipo del Restaurante",
          leisureAlt: "Equipo de Ocio"
        },
        message: "Nuestro equipo está formado por profesionales apasionados por la hospitalidad",
        local: "95% de los colaboradores son de la región de Fortaleza"
      },
      form: {
        title: "Envía tu Mensaje",
        fields: {
          name: "Nombre Completo *",
          email: "Email *",
          phone: "Teléfono/WhatsApp *",
          subject: "Asunto *",
          message: "Mensaje *"
        },
        placeholders: {
          name: "Tu nombre",
          email: "tu@email.com",
          phone: "(85) 9 9999-9999",
          subject: "¿Sobre qué quieres hablar?",
          message: "Escribe tu mensaje aquí..."
        },
        button: "Enviar Mensaje",
        response: "Responderemos en hasta 24 horas hábiles"
      },
      info: {
        title: "Informaciones de Contacto",
        subtitle: "Habla con nosotros por los canales abajo o visítanos personalmente",
        address: "Dirección",
        phone: "Teléfono",
        whatsapp: "WhatsApp",
        email: "Email",
        hours: "Horario de Atención",
        reception: "Recepción: 24 horas",
        commercial: "Atención comercial: 8h a 18h",
        social: "Redes Sociales"
      },
      location: {
        title: "Ubicación Privilegiada",
        subtitle: "Frente a la Playa de Iracema, cerca de los principales puntos turísticos de Fortaleza",
        ponte: "Puente de los Ingleses",
        dragao: "Centro Dragão do Mar",
        airport: "Aeropuerto de Fortaleza",
        ponteDistance: "5 minutos a pie",
        dragaoDistance: "10 minutos a pie",
        airportDistance: "15 minutos en coche"
      },
      locationGallery: {
        items: {
          front: { title: "Frente al Mar", alt: "Vista del Hotel" },
          facade: { title: "Fácil Acceso", alt: "Fachada del Hotel" },
          external: { title: "Entrada Principal", alt: "Área Externa" },
          reception: { title: "Recepción Acogedora", alt: "Recepción" }
        }
      },
      gallery: {
        title: "Ubicación Privilegiada",
        subtitle: "Frente a la Playa de Iracema, cerca de los principales puntos turísticos de Fortaleza"
      }
    },
    // Página Home - Localização
    home: {
      experiences: {
        title: "Experiencias Inolvidables",
        subtitle: "Descubre cada momento especial que preparamos para ti frente a la Playa de Iracema",
        cards: {
          pool: {
            title: "Piscina Vista al Mar",
            description: "Relájate en nuestra piscina con vista privilegiada al océano Atlántico. Tumbonas, ducha y servicio de restaurante.",
            badge: "Vista Panorámica",
            cta: "Explorar Ocio"
          },
          gastronomy: {
            title: "Gastronomía Regional",
            description: "Saborea lo mejor de la cocina cearense con desayuno regional premiado y restaurante con mariscos frescos.",
            badge: "Café Premiado",
            cta: "Ver Menú"
          },
          rooms: {
            title: "Habitaciones con Vista",
            description: "Alojamientos elegantes con vista al mar, camas premium y amenities de calidad para tu máximo confort.",
            badge: "Confort Premium",
            cta: "Ver Habitaciones"
          },
          spa: {
            title: "Spa & Relajación",
            description: "Sesiones de masaje, espacio fitness climatizado y área de bienestar para renovar tus energías.",
            badge: "Bienestar",
            cta: "Agendar Masaje"
          },
          beachTennis: {
            title: "Beach Tennis Gratuito",
            description: "Clases gratuitas de beach tennis con profesor especializado, material incluido y vista al mar.",
            badge: "Incluido",
            cta: "Saber Más"
          },
          sustainability: {
            title: "Pet Friendly",
            description: "¡Tu mejor amigo es bienvenido! Ambiente acogedor para ti y tu mascota, con áreas específicas y cuidados especiales.",
            badge: "Pet Friendly",
            cta: "Saber Más"
          }
        }
      },
      photoStory: {
        title: "Un Día en el Hotel Sonata",
        subtitle: "Desde el amanecer hasta el atardecer, cada momento es especial frente a la Playa de Iracema",
        items: {
          sunrise: {
            title: "Amanecer en la Piscina",
            description: "Comienza el día con vista privilegiada al amanecer sobre el océano Atlántico. Nuestra piscina abre a las 6h para los huéspedes que aman aprovechar la tranquilidad de la mañana.",
            time: "6:00"
          },
          breakfast: {
            title: "Desayuno Regional",
            description: "Buffet completo con tapiocas hechas al momento, frutas tropicales frescas, panes artesanales y el mejor café regional. Todo con vista al mar.",
            time: "7:00 - 10:00"
          },
          bike: {
            title: "Paseo en Bici por la Orla",
            description: "Bicicletas gratuitas para explorar la orla de Fortaleza. Visita el Puente de los Ingleses, Centro Dragão do Mar y otros puntos turísticos.",
            time: "9:00"
          },
          beachTennis: {
            title: "Beach Tennis en la Playa",
            description: "Clases gratuitas con profesor especializado. Material incluido, solo el sol y el mar de Fortaleza como escenario.",
            time: "10:00"
          },
          lunch: {
            title: "Almuerzo con Mariscos",
            description: "Restaurante con especialidades en mariscos frescos y cocina cearense. Platos que celebran los sabores locales.",
            time: "12:00 - 15:00"
          },
          spa: {
            title: "Relajación en el Spa",
            description: "Sesiones de masaje con cita previa. Un momento de puro bienestar y renovación de energías durante tu estadía.",
            time: "15:00"
          },
          poolAfternoon: {
            title: "Tarde en la Piscina",
            description: "Aprovecha el sol de la tarde con agua de coco fría, música ambiental y la brisa del mar. Nuestro bar sirve tragos y aperitivos.",
            time: "16:00"
          },
          sunset: {
            title: "Atardecer Inolvidable",
            description: "El momento más esperado del día. Asiste al atardecer con colores increíbles reflejándose en el mar de Iracema.",
            time: "17:30"
          }
        }
      },
      gallery: {
        title: "Momentos Inolvidables",
        subtitle: "Cada rincón del Hotel Sonata fue pensado para crear recuerdos especiales",
        items: {
          poolArea: { alt: "Área de la Piscina", title: "Área de Ocio" },
          poolView: { alt: "Vista de la Piscina", title: "Vista Panorámica" },
          breakfast: { alt: "Desayuno", title: "Café Regional" },
          gym: { alt: "Gimnasio", title: "Espacio Fitness" },
          panoramicView: { alt: "Vista Panorámica", title: "Vista del Hotel" },
          goldenHour: { alt: "Piscina al Atardecer", title: "Golden Hour" },
          spa: { alt: "Espacio de Relajación", title: "Spa" },
          bikes: { alt: "Bicicletas", title: "Explora la Ciudad" },
          restaurant: { alt: "Restaurante", title: "Experiencia Gastronómica" }
        }
      },
      location: {
        subtitle: "Ubicación privilegiada en el corazón de Fortaleza, con acceso directo a la playa y cerca de los principales puntos turísticos",
        spots: {
          iracema: {
            name: "Playa de Iracema",
            distance: "Frente al hotel"
          },
          ponte: {
            name: "Puente de los Ingleses",
            distance: "5 minutos a pie"
          },
          dragao: {
            name: "Centro Dragão do Mar",
            distance: "10 minutos a pie"
          },
          orla: {
            name: "Orla de Fortaleza",
            distance: "Explora en bicicleta"
          }
        },
        highlight: {
          title: "Lo Mejor de Fortaleza en Tu Puerta",
          items: {
            beach: {
              title: "Playa de Iracema",
              description: "Vista privilegiada, amanecer espectacular y vida nocturna vibrante"
            },
            culture: {
              title: "Cultura & Arte",
              description: "Centro Dragão do Mar, museos, teatro y gastronomía regional"
            },
            mobility: {
              title: "Movilidad",
              description: "Bicicletas gratuitas para explorar la orla y puntos turísticos"
            }
          }
        }
      }
    },
    // Footer
    footer: {
      description: "Tu casa en Fortaleza. La tradición de acoger, el placer de renovarse.",
      quickMenu: "Menú Rápido",
      contact: "Contacto",
      address: "Playa de Iracema, Fortaleza - CE",
      copyright: "Todos los derechos reservados.",
      credibility: {
        title: "Certificaciones",
        trust: "Hotel Certificado y Seguro"
      }
    }
  },
  en: {
    // Página de Quartos
    rooms: {
      hero: {
        title: "Rooms with Sea View",
        subtitle: "All our rooms offer privileged sea views. Wake up to the sun rising over the waters of Iracema Beach."
      },
      section: {
        title: "Choose Your Accommodation",
        subtitle: "Comfort, sophistication and the most beautiful view in Fortaleza"
      },
      empty: "No rooms available at the moment.",
      cta: {
        title: "Ready for Your Experience?",
        subtitle: "Book now and guarantee the best rates and special conditions",
        bookNow: "Book Now",
        contact: "Contact Us"
      },
      highlights: {
        comfort: { title: "Premium Comfort", description: "Comfortable beds and high-quality linens" },
        view: { title: "Sea View", description: "Rooms with privileged view of Iracema Beach" },
        ac: { title: "Air Conditioning", description: "Individual climate control in all rooms" }
      },
      gallery: {
        title: "Wake Up to Sea Views",
        subtitle: "Elegant and comfortable rooms with privileged views of Iracema Beach",
        items: {
            suite: "Premium Suite",
            standard: "Elegance",
            reception: "24h Reception",
            common: "Common Areas",
            pool: "Pool View"
        }
      },
      photoStory: {
        title: "Details That Make a Difference",
        subtitle: "Every element was designed to provide maximum comfort and well-being",
        items: {
            beds: { title: "Premium Beds", description: "High-quality mattresses with premium linens. Soft pillows and cozy duvets to ensure perfect nights of sleep." },
            view: { title: "Stunning View", description: "Wake up every day with a view of the Atlantic Ocean. Rooms strategically positioned to enjoy the sunrise." },
            modern: { title: "Modern Environments", description: "Contemporary design with local touches. Individual air conditioning, smart TV, minibar and quality amenities." },
            shared: { title: "Shared Spaces", description: "Besides the comfort of the room, enjoy common areas like pool, terrace and gardens for leisure moments." }
        }
      }
    },
    // Página de Gastronomia
    gastronomy: {
      hero: {
        title: "Enchanting Gastronomy",
        subtitle: "Authentic flavors, local ingredients and the best view in Fortaleza"
      },
      breakfast: {
        badge: "Award-winning",
        title: "Award-winning Breakfast",
        description: "Start your day with an unforgettable breakfast. Our special selection includes fresh tropical fruits, artisan breads, tapiocas prepared to order, and the best regional coffee.",
        scheduleTitle: "Schedule",
        scheduleWeekday: "Monday to Friday: 6:30 AM to 10 AM",
        scheduleWeekend: "Saturdays and Sundays: 7 AM to 10:30 AM",
        highlightsTitle: "Highlights"
      },
      restaurant: {
        title: "Restaurant",
        description: "Enjoy dishes that celebrate the rich cuisine of Ceará, prepared with fresh and local ingredients. Our kitchen combines tradition and innovation to create memorable gastronomic experiences.",
        scheduleTitle: "Opening Hours",
        lunch: "Lunch: 12 PM to 3 PM",
        dinner: "Dinner: 6:30 PM to 10 PM",
        ourKitchen: "Our Kitchen"
      },
      roomService: {
        title: "Room Service",
        description: "Enjoy our delicacies in the comfort of your room. Service available 24 hours for your convenience.",
        available: "Available 24 hours"
      },
      cta: {
        title: "Book and Taste",
        subtitle: "Breakfast included in all reservations. Come and try!",
        bookNow: "Make a Reservation"
      },
      highlightsList: {
        tapioca: "Tapiocas and crepiocas prepared to order",
        fruits: "Seasonal tropical fruits",
        breads: "Artisan breads and cakes",
        coffee: "Award-winning regional coffee",
        vegan: "Vegetarian and vegan options",
        view: "Panoramic sea view"
      },
      gallery: {
        breakfast: { title: "Start the Day with Flavor", subtitle: "Complete buffet with regional delicacies, tropical fruits and fresh tapiocas", badge: "Regional Breakfast" },
        restaurant: { title: "Complete Gastronomic Experience", subtitle: "From breakfast to dinner, every meal is a celebration of Ceará flavors", badge: "Our Restaurant" },
        items: {
            buffet: "Complete Buffet",
            tapioca: "Fresh Tapiocas",
            fruits: "Fresh Fruits",
            breads: "Homemade Breads and Cakes",
            juices: "Juices and Smoothies",
            coffee: "Ceará Coffee",
            environment: "Sophisticated Environment",
            table: "Sea View",
            dishes: "Haute Cuisine",
            ocean: "From Ocean to You",
            flavor: "Ceará Flavors",
            moment: "Special Moments"
        }
      },
      photoStory: {
        title: "From Sea to Your Table",
        subtitle: "A gastronomic journey through Ceará flavors",
        items: {
            restaurant: { title: "Restaurant with View", description: "Elegant and cozy environment with sea view. The perfect setting for your meals, whether a business lunch or a romantic dinner." },
            seafood: { title: "Fresh Seafood", description: "We work only with fresh seafood, direct from local fishermen. Lobster, shrimp, fish and other ocean delights prepared with mastery." },
            chef: { title: "Chef's Special", description: "Our chef creates exclusive dishes that mix contemporary techniques with traditional Ceará cuisine flavors." },
            breakfast: { title: "Award-winning Breakfast", description: "Recognized by guests as one of the best breakfasts in Fortaleza. Variety, quality and sea view." }
        }
      }
    },
    // Página de Lazer
    leisure: {
      hero: {
        title: "Your True Living Room",
        subtitle: "Iracema Beach is the cultural heart of Fortaleza. And you're in the best place to experience it intensely."
      },
      section: {
        title: "Unforgettable Experiences",
        subtitle: "Activities and leisure for every moment of your stay"
      },
      location: {
        badge: "Iracema Beach",
        title: "Cultural Heart of Fortaleza",
        description: "Located on the iconic Iracema Beach, you are steps away from the main tourist attractions, renowned restaurants, vibrant nightlife and authentic Ceará culture."
      },
      cta: {
        title: "Live the Complete Experience",
        subtitle: "Book now and enjoy all activities included in your stay",
        bookNow: "Make a Reservation"
      },
      photoStory: {
        title: "Your Complete Leisure Day",
        subtitle: "Free and paid activities for all tastes",
        items: {
            gym: { title: "Gym with View", description: "Start the day with exercises in our air-conditioned gym with sea view. Modern equipment and reserved environment available from 6am to 10pm.", time: "6:00 AM - 10:00 PM" },
            tennis: { title: "Free Beach Tennis", description: "Free classes with specialized instructor. Equipment included, just enjoy the sun and fun with a view of the Fortaleza sea.", time: "10:00 AM" },
            bike: { title: "Bike Ride", description: "Free bicycle service to explore Iracema Beach, English Bridge and Dragão do Mar Center. Adventure through the city!", time: "All day" },
            spa: { title: "Massage and Spa", description: "Therapeutic massage sessions by appointment. Relax and renew your energy in a quiet and welcoming environment.", time: "By appointment" }
        }
      },
      gallery: {
        pool: { title: "Relax Oceanfront", subtitle: "Privileged view, comfortable loungers and restaurant service in the pool area", badge: "Pool with View" },
        fitness: { title: "Keep Your Workout Routine", subtitle: "Air-conditioned gym with modern equipment and sea view", badge: "Fitness Space" },
        activities: { title: "Fun for the Whole Family", subtitle: "Beach tennis, bikes and much more included in your stay", badge: "Free Activities" },
        spa: { title: "Pure Relaxation Moments", subtitle: "Therapeutic massages in a quiet and welcoming environment", badge: "Spa & Wellness" },
        items: {
            view: "Panoramic View",
            leisure: "Leisure Area",
            relax: "Relaxation",
            golden: "Golden Hour",
            outdoor: "Outdoor Space",
            hotelView: "Hotel View",
            modern: "Modern Equipment",
            complete: "Complete Space",
            cardio: "Complete Workout",
            class: "Free Classes",
            instructor: "With Instructor",
            explore: "Explore the City",
            tour: "Guided Tours",
            massage: "Relaxing Environment",
            wellness: "Tranquility",
            comfort: "Comfort",
            renewal: "Renewal"
        }
      },
      contactReception: {
        text: "For more information about our services, contact the reservations or reception department",
        button: "Contact Reception"
      },
      locationPrivileged: {
        title: "Privileged Location",
        near: "Just steps away",
        nearDescription: "English Bridge, Dragão do Mar Center, Mercado dos Pinhões",
        seaFront: "Oceanfront",
        seaFrontDescription: "Privileged view of the sunrise"
      }
    },
    // Página ESG
    esg: {
      hero: {
        title: "Commitment to the Future",
        subtitle: "Sustainability, inclusion and social responsibility at the heart of our actions",
        badge: "ESG & Sustainability",
        imageAlt: "Sustainable Hotel - Sonata de Iracema"
      },
      practices: {
        title: "Our Practices in Action",
        subtitle: "See how we implement sustainability in every detail of the hotel"
      },
      gallery: {
        solar: { title: "Solar Panels", alt: "Solar Energy" },
        green: { title: "Environmental Preservation", alt: "Green Areas" },
        local: { title: "Local Production", alt: "Local Products" },
        food: { title: "Organic Ingredients", alt: "Sustainable Food" },
        water: { title: "Water Saving", alt: "Water Management" },
        transport: { title: "Green Mobility", alt: "Sustainable Transport" }
      },
      actions: {
        waste: {
          title: "Waste Management",
          description: "Selective collection and recycling of 80% of waste generated",
          items: ["Complete recycling program", "Composting of organic waste", "Reduction of disposable plastics", "Partnership with local cooperatives"]
        },
        water: {
          title: "Water Saving",
          description: "Intelligent reuse and water saving systems",
          items: ["Rainwater harvesting", "Water-saving taps and showers", "Water treatment", "Awareness program"]
        },
        energy: {
          title: "Clean Energy",
          description: "40% reduction in energy consumption with sustainable technology",
          items: ["Solar panels for heating", "LED lighting throughout the hotel", "Efficient air conditioning", "Presence sensors"]
        },
        local: {
          title: "Local Products",
          description: "Valuing the local economy and reducing carbon footprint",
          items: ["90% of food is local", "Partnerships with regional producers", "Eco-friendly cleaning products", "Biodegradable amenities"]
        }
      },
      inclusionActions: {
        accessibility: {
          title: "Accessibility",
          description: "Infrastructure adapted for everyone",
          items: ["Rooms adapted for PWDs", "Access ramps", "Accessible bathrooms", "Staff trained in Sign Language"]
        },
        diversity: {
          title: "Diversity",
          description: "Inclusive and respectful environment for all people",
          items: ["Non-discrimination policy", "Diverse and trained staff", "Certified safe space", "Respect for all identities"]
        }
      },
      impactPhotoStory: {
        localProd: {
          title: "Valuing Local Production",
          description: "90% of our food comes from local producers. We support the regional economy and reduce our carbon footprint with local transport."
        },
        mobility: {
          title: "Sustainable Mobility",
          description: "We encourage sustainable tourism with free bicycles to explore Fortaleza in an eco-friendly and healthy way."
        },
        resources: {
          title: "Intelligent Resource Management",
          description: "Water reuse system, 100% LED lighting, solar panels and presence sensors for energy saving."
        },
        team: {
          title: "Local and Diverse Team",
          description: "95% of our employees are from the region. We value diversity, inclusion and offer continuous training."
        }
      },
      sustainability: {
        title: "Environmental Sustainability",
        subtitle: "Concrete actions to reduce our impact on the planet"
      },
      inclusion: {
        title: "Inclusion and Diversity",
        subtitle: "A welcoming and respectful space for all people"
      },
      commitment: {
        title: "Our Commitment to the Future",
        subtitle: "Small actions, big positive impact"
      },
      social: {
        title: "Social Commitment",
        description: "We believe that a hotel does not exist in isolation from the community. Therefore, we maintain partnerships and actions that strengthen the local economy and support social projects in Fortaleza.",
        together: "Together for the Community",
        togetherSubtitle: "Partnerships and actions that strengthen Fortaleza",
        support: {
          title: "Support for Local Artists",
          description: "Exhibition and sale of works by Ceará artists at the hotel"
        },
        jobs: {
          title: "Local Jobs",
          description: "95% of our team is made up of professionals from the region"
        },
        suppliers: {
          title: "Regional Suppliers",
          description: "Priority for products and services from local companies"
        }
      },
      certifications: {
        title: "Recognition and Certifications",
        subtitle: "Our commitment is recognized by national and international organizations"
      },
      cta: {
        title: "Stay with Purpose",
        subtitle: "By choosing Hotel Sonata, you support sustainable and responsible practices",
        button: "Make a Reservation"
      }
    },
    // Página Eventos
    events: {
      hero: {
        title: "Host Your Corporate Event With Us",
        subtitle: "With a complex that combines event space and accommodation, we have one of the largest room capacities within a hotel",
        badge: "8 Rooms Available"
      },
      gallery: {
        badge: "Our Spaces",
        title: "Versatile Environments for Your Event",
        subtitle: "8 exclusive rooms on dedicated floors, with natural lighting and independent air conditioning",
        items: {
          main: { title: "Main Room", alt: "Main Event Room" },
          corporate: { title: "Corporate Space", alt: "Auditorium Setup" },
          meeting: { title: "Meeting Room", alt: "Executive Meetings" },
          coffee: { title: "Coffee Break Space", alt: "Coffee Break" },
          outdoor: { title: "Outdoor Event Area", alt: "Outdoor Events" },
          pool: { title: "Pool Event Space", alt: "Ocean View Events" }
        }
      },
      facilities: {
        title: "Complete Structure for Your Event",
        subtitle: "8 rooms on exclusive floors with all the infrastructure needed for your event's success",
        items: {
          naturalLight: { title: "Natural Lighting", description: "All rooms with natural lighting" },
          ac: { title: "Independent Air Conditioning", description: "Independent system per room" },
          exclusive: { title: "8 Exclusive Rooms", description: "On dedicated event floors" },
          parking: { title: "Parking", description: "Next to the hotel, easy access" },
          foyer: { title: "Foyer and Spaces", description: "Outdoor areas and foyer" },
          gastronomy: { title: "Own Gastronomy", description: "Wide range of menus" }
        }
      },
      capacity: {
        badge: "8 Rooms Available",
        title: "Capacity by Configuration",
        subtitle: "Quickly compare all rooms and choose the ideal configuration for your event. All with independent air conditioning and natural lighting.",
        note: "* Capacities may vary according to the chosen configuration and specific event needs"
      },
      configurations: {
        title: "Configurations for Every Occasion",
        subtitle: "We adapt the space to your event's needs: auditorium, classroom, cocktail or banquet",
        items: {
          auditorium: { title: "Auditorium Format", description: "Ideal for lectures, workshops and presentations (up to 100 people)" },
          school: { title: "Classroom Format", description: "Perfect for trainings and courses (up to 60 people)" },
          banquet: { title: "Banquet Format", description: "Weddings and special dinners (up to 80 people)" },
          cocktail: { title: "Cocktail Format", description: "Networking and gatherings (up to 150 people)" }
        }
      },
      layout: {
        badge: "Complete Layout",
        title: "Event Space Floor Plan",
        subtitle: "Overview of the distribution of our 8 rooms on exclusive floors",
        note: "* The floor plan is illustrative. Configurations can be adapted according to event needs",
        button: "Request Custom Quote"
      },
      types: {
        title: "Events for All Occasions",
        subtitle: "Complete structure and specialized team to make your dream event come true",
        items: {
          corporate: {
            title: "Corporate Events",
            description: "Meetings, trainings, workshops and conventions with all necessary structure.",
            capacity: "Up to 100 people",
            features: ["High-speed Wi-Fi", "Projector and screen", "Sound system", "Coffee break included", "Parking"]
          },
          wedding: {
            title: "Weddings",
            description: "The perfect setting for the most special day of your life, with ocean view.",
            capacity: "Up to 150 people",
            features: ["Oceanfront ceremony", "Personalized reception", "Exclusive decoration", "Custom menu", "Bridal suite"]
          },
          anniversary: {
            title: "Anniversaries and Birthdays",
            description: "Celebrate special moments with elegance and sophistication.",
            capacity: "Up to 80 people",
            features: ["Versatile spaces", "Custom menu", "Decoration included", "Dedicated team", "Ocean view"]
          },
          social: {
            title: "Social Events",
            description: "Gatherings, graduations and various celebrations.",
            capacity: "Up to 120 people",
            features: ["Flexible environments", "Complete catering", "Bar included", "DJ and sound system", "Special lighting"]
          }
        }
      },
      form: {
        title: "Request a Quote",
        subtitle: "Fill out the form and our team will contact you within 24 hours",
        fields: {
          name: "Full Name *",
          email: "Corporate Email *",
          phone: "Phone/WhatsApp *",
          company: "Company",
          eventType: "Event Type *",
          date: "Expected Date *",
          guests: "Number of Guests *",
          message: "Message"
        },
        eventTypes: {
          corporate: "Corporate Event",
          wedding: "Wedding",
          anniversary: "Anniversary/Celebration",
          social: "Social Event",
          other: "Other"
        },
        button: "Request Quote",
        privacy: "By submitting this form, you agree to our privacy policy"
      },
      cta: {
        title: "Personalized Service",
        subtitle: "Prefer to speak directly with our events team?",
        call: "Call Now",
        whatsapp: "WhatsApp"
      },
      access: {
        title: "Access and Location",
        items: ["Easy access by stairs and elevators", "First and second level of the hotel", "Parking next door"]
      },
      included: {
        title: "Included Services",
        items: ["In-house gastronomy with wide menu options", "Exclusive events team", "Outdoor spaces available"]
      }
    },
    // Página Hotel
    hotel: {
      hero: {
        badge: "20 Years of History",
        title: "Your Home in Fortaleza",
        subtitle: "The tradition of welcoming, the pleasure of renewal"
      },
      history: {
        title: "Our History",
        paragraph1: "In 2005, the Bezerra Family realized the dream of creating a hotel that was more than accommodation: a true home for those visiting Fortaleza.",
        paragraph2: "With a privileged location on the iconic Iracema Beach, Hotel Sonata was born with a unique feature: all rooms with sea views, without exception. A promise we have kept for 20 years.",
        paragraph3: "Throughout these two decades, we have welcomed thousands of guests from all over the world, always maintaining the essence of family hospitality and the constant pursuit of excellence in service.",
        paragraph4: "Today, we celebrate not just 20 years of operation, but two decades of stories, smiles, reunions and memories created together with our guests."
      },
      journey: {
        title: "Our Journey",
        subtitle: "Two decades of evolution, always maintaining our essence"
      },
      timeline: {
        start: {
          title: "The Beginning",
          description: "Opening of Hotel Sonata de Iracema by the Bezerra Family"
        },
        expansion: {
          title: "First Expansion",
          description: "Expansion with new rooms and leisure area"
        },
        renovation: {
          title: "Total Renovation",
          description: "Complete modernization of facilities"
        },
        sustainability: {
          title: "Sustainability",
          description: "Implementation of sustainable practices and ESG"
        },
        anniversary: {
          title: "20 Years",
          description: "Celebrating two decades of hospitality"
        }
      },
      differentialsSection: {
        title: "What Makes Us Unique",
        subtitle: "Differentials that make Sonata your best choice in Fortaleza"
      },
      differentials: {
        seaView: {
          title: "100% Sea View",
          description: "All rooms with privileged sea views. Without exception."
        },
        location: {
          title: "Unique Location",
          description: "Heart of Iracema Beach, cultural center of Fortaleza."
        },
        family: {
          title: "Family Service",
          description: "Family management that guarantees genuine hospitality."
        },
        breakfast: {
          title: "Award-winning Breakfast",
          description: "Breakfast recognized by guests and critics."
        }
      },
      family: {
        title: "Family Management",
        imageAlt: "Bezerra Family",
        paragraph1: "Hotel Sonata de Iracema is proudly a family-run hotel. The Bezerra Family is present in the hotel's daily life, ensuring that each guest receives the personalized and welcoming service expected from a true home.",
        paragraph2: "This closeness with our guests allows us to understand and anticipate needs, create lasting bonds and transform stays into memorable experiences."
      },
      cta: {
        title: "Be Part of Our History",
        subtitle: "Come visit the hotel that for 20 years has made Fortaleza an even more special destination",
        button: "Make a Reservation"
      },
      bikes: {
        message: "Use our free bicycles to explore the waterfront and discover Fortaleza in a sustainable way"
      },
      gallery: {
        title: "Discover Our Facilities",
        subtitle: "Explore every detail of our hotel through images that capture the essence of comfort and hospitality",
        items: {
            pool: "Sea View Pool",
            leisure: "Leisure Area",
            relax: "Relaxation",
            comfort: "Comfort and Leisure",
            outdoor: "Outdoor Space",
            view: "Hotel View",
            restaurant: "Our Restaurant",
            fitness: "Fitness Space",
            spa: "Relaxation Area"
        }
      },
      explore: {
        title: "Explore Fortaleza",
        subtitle: "Discover the charms of the capital of Ceará from our hotel",
        spots: {
            beach: { title: "Iracema Beach", description: "Urban beach famous for sunset, nightlife and the iconic English Bridge. History and modernity meet.", badge: "In front of hotel" },
            culture: { title: "Dragão do Mar Center", description: "Cultural complex with museums, cinema, theater, planetarium and gastronomy. Cultural heart of Fortaleza.", badge: "10 min walk" },
            market: { title: "Pinhões Market", description: "Ceará crafts, bobbin lace, ceramics and regional products. Authentic local culture and tradition.", badge: "5 min walk" }
        }
      },
    },
    // Seção de Acomodações
    accommodations: {
      title: "Discover Our Accommodations",
      subtitle: "117 apartments available, all with beach views. Wake up to the sun and the vastness of the sea, and watch the spectacle of our sunset. A unique view in the city of Fortaleza.",
      cards: {
        seaView: {
          title: "100% Sea View",
          description: "All our 117 apartments have privileged sea views"
        },
        comfort: {
          title: "Complete Comfort",
          description: "Apartments equipped for your maximum comfort and well-being"
        },
        petFriendly: {
          title: "Pet Friendly",
          description: "We welcome pets up to 10kg with all necessary facilities"
        }
      },
      petFriendly: {
        title: "We Are Pet Friendly!",
        subtitle: "We know our pets are part of the family",
        weOffer: "What we offer:",
        offer1: "Comfortable bed to use in the room",
        offer2: "Bowls for water and food",
        offer3: "Welcoming environment for pets up to 10kg",
        important: "Important information:",
        rule1: "Pets must stay close to their guardians (in arms or transport carrier)",
        rule2: "Avoid staying in the restaurant area",
        fee: "Fee of <strong class=\"text-foreground\">R$ 70 per night</strong> per pet"
      },
      button: "View All Apartments"
    },
    // Serviços de Lazer
    leisureServices: {
      title: "Our Leisure & Wellness Options",
      subtitle: "We have options for you to enjoy moments of well-being and joy at our Hotel",
      pool: {
        title: "Pool Area",
        description: "Sun loungers, outdoor shower and sea view. You can also count on the service of our restaurant in this area, to enjoy a cold coconut water, juices and other drinks and snacks.",
        schedule: "6:00 AM to 8:00 PM",
        badge: "Sea View",
        tags: ["Restaurant", "Coconut Water", "Relaxation"]
      },
      fitness: {
        title: "Fitness Space",
        description: "Reserved, air-conditioned environment with sea view for you to exercise as you prefer. Modern equipment in a space designed for your well-being.",
        schedule: "6:00 AM to 10:00 PM",
        badge: "Air Conditioned",
        tags: ["Sea View", "Modern Equipment", "Air Conditioned"]
      },
      bikes: {
        title: "Bike Availability",
        description: "Free service for our guests to enjoy rides and get to know the city in the best way, with the sea breeze and lots of fun.",
        badge: "Free",
        tags: ["Tour", "Waterfront", "Sustainable"]
      },
      beachTennis: {
        title: "Beach Tennis Classes",
        description: "Your stay gains even more energy and fun. Our guests have free access to beach tennis classes, with a specialized instructor, equipment included and a stunning view: the Fortaleza sea right in front.",
        badge: "Free",
        tags: ["Specialized Instructor", "Equipment Included", "Sea View"]
      },
      massage: {
        title: "Massage Sessions",
        description: "Relax and renew your energy with our scheduled massage sessions. A moment of pure well-being during your stay.",
        badge: "By Appointment",
        tags: ["Relaxation", "Wellness", "Therapeutic"]
      },
      footer: {
        text: "For more information about our services, contact the reservations or reception department",
        exploreButton: "Explore All Experiences",
        contactButton: "Contact Reception"
      }
    },
    // Seção de Prêmios
    awards: {
      badge: "Recognition",
      titleHighlight: "Your experiences",
      titleRest: "drive us forward",
      subtitle: "Certifications and awards that prove our quality and commitment to excellence",
      tripadvisor: {
        excellent: "Excellent",
        location: "Location",
        walkable: "Great for pedestrians",
        score: "Score: 99 out of 100"
      },
      excellenceAwards: "Excellence Awards",
      otherCertifications: "Other Certifications"
    },
    // Página Contato
    contact: {
      hero: {
        title: "Contact Us",
        subtitle: "We are ready to serve you and make your stay unforgettable",
        badge: "24h Service"
      },
      team: {
        title: "Our Team Awaits You",
        subtitle: "Humanized and personalized service to make your experience unique",
        reception: {
          title: "24h Reception",
          description: "Always ready to serve"
        },
        gastronomy: {
          title: "Gastronomy",
          description: "Flavors prepared with care"
        },
        leisure: {
          title: "Leisure & Events",
          description: "Taking care of every detail"
        },
        images: {
          receptionAlt: "Hotel Reception",
          gastronomyAlt: "Restaurant Team",
          leisureAlt: "Leisure Team"
        },
        message: "Our team is made up of professionals passionate about hospitality",
        local: "95% of our employees are from the Fortaleza region"
      },
      form: {
        title: "Send Your Message",
        fields: {
          name: "Full Name *",
          email: "Email *",
          phone: "Phone/WhatsApp *",
          subject: "Subject *",
          message: "Message *"
        },
        placeholders: {
          name: "Your name",
          email: "your@email.com",
          phone: "(85) 9 9999-9999",
          subject: "What would you like to talk about?",
          message: "Write your message here..."
        },
        button: "Send Message",
        response: "We will respond within 24 business hours"
      },
      info: {
        title: "Contact Information",
        subtitle: "Contact us through the channels below or visit us in person",
        address: "Address",
        phone: "Phone",
        whatsapp: "WhatsApp",
        email: "Email",
        hours: "Service Hours",
        reception: "Reception: 24 hours",
        commercial: "Commercial service: 8 AM to 6 PM",
        social: "Social Media"
      },
      location: {
        title: "Privileged Location",
        subtitle: "In front of Iracema Beach, close to the main tourist attractions in Fortaleza",
        ponte: "English Bridge",
        dragao: "Dragão do Mar Center",
        airport: "Fortaleza Airport",
        ponteDistance: "5 minutes walk",
        dragaoDistance: "10 minutes walk",
        airportDistance: "15 minutes by car"
      },
      locationGallery: {
        items: {
          front: { title: "Beachfront", alt: "Hotel View" },
          facade: { title: "Easy Access", alt: "Hotel Facade" },
          external: { title: "Main Entrance", alt: "External Area" },
          reception: { title: "Welcoming Reception", alt: "Reception" }
        }
      },
      gallery: {
        title: "Privileged Location",
        subtitle: "In front of Iracema Beach, close to the main tourist attractions in Fortaleza"
      }
    },
    // Página Home - Localização
    home: {
      experiences: {
        title: "Unforgettable Experiences",
        subtitle: "Discover every special moment we prepared for you in front of Iracema Beach",
        cards: {
          pool: {
            title: "Ocean View Pool",
            description: "Relax in our pool with a privileged view of the Atlantic Ocean. Sun loungers, shower and restaurant service.",
            badge: "Panoramic View",
            cta: "Explore Leisure"
          },
          gastronomy: {
            title: "Regional Gastronomy",
            description: "Savor the best of Ceará cuisine with award-winning regional breakfast and restaurant with fresh seafood.",
            badge: "Award-winning Breakfast",
            cta: "View Menu"
          },
          rooms: {
            title: "Rooms with View",
            description: "Elegant accommodations with sea view, premium beds and quality amenities for your maximum comfort.",
            badge: "Premium Comfort",
            cta: "View Rooms"
          },
          spa: {
            title: "Spa & Relaxation",
            description: "Massage sessions, air-conditioned fitness space and wellness area to renew your energy.",
            badge: "Wellness",
            cta: "Book Massage"
          },
          beachTennis: {
            title: "Free Beach Tennis",
            description: "Free beach tennis classes with specialized instructor, equipment included and sea view.",
            badge: "Included",
            cta: "Learn More"
          },
          sustainability: {
            title: "Pet Friendly",
            description: "Your best friend is welcome! Welcoming environment for you and your pet, with specific areas and special care.",
            badge: "Pet Friendly",
            cta: "Learn More"
          }
        }
      },
      photoStory: {
        title: "A Day at Hotel Sonata",
        subtitle: "From dawn to sunset, every moment is special in front of Iracema Beach",
        items: {
          sunrise: {
            title: "Sunrise at the Pool",
            description: "Start the day with a privileged view of the sunrise over the Atlantic Ocean. Our pool opens at 6 AM for guests who love to enjoy the tranquility of the morning.",
            time: "6:00"
          },
          breakfast: {
            title: "Regional Breakfast",
            description: "Complete buffet with freshly made tapiocas, fresh tropical fruits, artisan breads and the best regional coffee. All with sea view.",
            time: "7:00 - 10:00"
          },
          bike: {
            title: "Bike Ride along the Waterfront",
            description: "Free bicycles to explore the Fortaleza waterfront. Visit the English Bridge, Dragão do Mar Center and other tourist spots.",
            time: "9:00"
          },
          beachTennis: {
            title: "Beach Tennis on the Beach",
            description: "Free classes with specialized instructor. Equipment included, only the sun and sea of Fortaleza as scenery.",
            time: "10:00"
          },
          lunch: {
            title: "Seafood Lunch",
            description: "Restaurant specializing in fresh seafood and Ceará cuisine. Dishes that celebrate local flavors.",
            time: "12:00 - 15:00"
          },
          spa: {
            title: "Spa Relaxation",
            description: "Massage sessions by appointment. A moment of pure well-being and energy renewal during your stay.",
            time: "15:00"
          },
          poolAfternoon: {
            title: "Afternoon at the Pool",
            description: "Enjoy the afternoon sun with cold coconut water, ambient music and the sea breeze. Our bar serves drinks and snacks.",
            time: "16:00"
          },
          sunset: {
            title: "Unforgettable Sunset",
            description: "The most awaited moment of the day. Watch the sunset with incredible colors reflecting in the sea of Iracema.",
            time: "17:30"
          }
        }
      },
      gallery: {
        title: "Unforgettable Moments",
        subtitle: "Every corner of Hotel Sonata was thought to create special memories",
        items: {
          poolArea: { alt: "Pool Area", title: "Leisure Area" },
          poolView: { alt: "Pool View", title: "Panoramic View" },
          breakfast: { alt: "Breakfast", title: "Regional Coffee" },
          gym: { alt: "Gym", title: "Fitness Space" },
          panoramicView: { alt: "Panoramic View", title: "Hotel View" },
          goldenHour: { alt: "Pool at Sunset", title: "Golden Hour" },
          spa: { alt: "Relaxation Space", title: "Spa" },
          bikes: { alt: "Bikes", title: "Explore the City" },
          restaurant: { alt: "Restaurant", title: "Gastronomic Experience" }
        }
      },
      location: {
        subtitle: "Privileged location in the heart of Fortaleza, with direct beach access and close to the main tourist attractions",
        spots: {
          iracema: {
            name: "Iracema Beach",
            distance: "In front of the hotel"
          },
          ponte: {
            name: "English Bridge",
            distance: "5 minutes walk"
          },
          dragao: {
            name: "Dragão do Mar Center",
            distance: "10 minutes walk"
          },
          orla: {
            name: "Fortaleza Waterfront",
            distance: "Explore by bike"
          }
        },
        highlight: {
          title: "The Best of Fortaleza at Your Door",
          items: {
            beach: {
              title: "Iracema Beach",
              description: "Privileged view, spectacular sunrise and vibrant nightlife"
            },
            culture: {
              title: "Culture & Arts",
              description: "Dragão do Mar Center, museums, theater and regional gastronomy"
            },
            mobility: {
              title: "Mobility",
              description: "Free bicycles to explore the waterfront and tourist spots"
            }
          }
        }
      }
    },
    // Footer
    footer: {
      description: "Your home in Fortaleza. The tradition of welcoming, the pleasure of renewal.",
      quickMenu: "Quick Menu",
      contact: "Contact",
      address: "Iracema Beach, Fortaleza - CE",
      copyright: "All rights reserved.",
      credibility: {
        title: "Certifications",
        trust: "Certified and Secure Hotel"
      }
    }
  }
};

export function getPageTranslation<T extends keyof typeof pageTranslations.pt>(
  locale: Locale,
  page: T
): typeof pageTranslations.pt[T] {
  return pageTranslations[locale][page];
}

