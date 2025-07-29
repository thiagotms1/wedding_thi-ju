# Instruções para Hospedar seu Site RSVP e Configurar Notificações

Este documento contém instruções detalhadas para hospedar o site RSVP do casamento de Thiago e Juliana e configurar as notificações por email.

## Índice
1. [Opções de Hospedagem](#opcoes-de-hospedagem)
2. [Configuração do Domínio Personalizado](#configuracao-do-dominio-personalizado)
3. [Configuração do EmailJS para Notificações](#configuracao-do-emailjs)
4. [Personalização do Site](#personalizacao-do-site)
5. [Manutenção do Site](#manutencao-do-site)

## Opções de Hospedagem {#opcoes-de-hospedagem}

Existem várias opções gratuitas e pagas para hospedar seu site RSVP. Abaixo listamos as melhores opções:

### Opções Gratuitas

1. **Netlify (RECOMENDADO)**
   - Limite gratuito generoso
   - Fácil integração com GitHub
   - SSL gratuito (HTTPS)
   - Interface amigável
   - Passos:
     1. Crie uma conta em [netlify.com](https://netlify.com)
     2. Arraste e solte a pasta do seu site ou conecte ao GitHub
     3. O site estará online em menos de 1 minuto

2. **GitHub Pages**
   - Hospedagem gratuita para sites estáticos
   - Limite de 1GB de armazenamento
   - SSL gratuito
   - Passos:
     1. Crie uma conta no [github.com](https://github.com)
     2. Crie um novo repositório
     3. Suba os arquivos do site para o repositório
     4. Nas configurações do repositório, ative o GitHub Pages

3. **Vercel**
   - Similar ao Netlify
   - Boa integração com GitHub
   - SSL gratuito
   - Passos:
     1. Crie uma conta em [vercel.com](https://vercel.com)
     2. Conecte ao GitHub ou faça upload direto dos arquivos
     3. Implante o site com apenas alguns cliques

4. **Firebase Hosting**
   - Hospedagem da Google
   - SSL gratuito
   - Integração com outros serviços Google
   - Passos:
     1. Crie uma conta no [firebase.google.com](https://firebase.google.com)
     2. Crie um novo projeto
     3. Instale as ferramentas Firebase CLI (`npm install -g firebase-tools`)
     4. Inicialize e implante o site com comandos simples

### Opções Pagas (Mais Robustas)

1. **HostGator Brasil**
   - Planos a partir de R$ 6,89/mês
   - Suporte técnico em português
   - Hospedagem no Brasil (melhor velocidade)
   - SSL gratuito

2. **Hostinger Brasil**
   - Planos a partir de R$ 8,99/mês
   - Interface fácil de usar
   - SSL gratuito
   - Servidores no Brasil

3. **Locaweb**
   - Empresa brasileira
   - Planos a partir de R$ 7,90/mês
   - Suporte local e confiável

## Configuração do Domínio Personalizado {#configuracao-do-dominio-personalizado}

Para um site de casamento, é recomendável ter um domínio personalizado como `thiagojuliana.com.br`. Aqui estão as opções:

### Onde Comprar um Domínio

1. **Registro.br** (para domínios .br)
   - Preço: Aproximadamente R$ 40/ano para .com.br
   - Site oficial brasileiro
   - [registro.br](https://registro.br)

2. **Locaweb**
   - Domínios .com.br a partir de R$ 22,90/ano
   - [locaweb.com.br](https://www.locaweb.com.br/registro-de-dominio-web/)

3. **HostGator Brasil**
   - Domínios .com.br a partir de R$ 25/ano
   - Integração fácil com hospedagem

### Como Configurar o Domínio com sua Hospedagem

#### Para Netlify:
1. Na conta Netlify, vá até seu site
2. Clique em "Domain settings"
3. Clique em "Add custom domain"
4. Digite seu domínio (ex: thiagojuliana.com.br)
5. Siga as instruções para verificar a propriedade do domínio
6. Configure os servidores DNS conforme instruções do Netlify
7. Aguarde a propagação (pode levar até 48 horas)

#### Para GitHub Pages:
1. No repositório, vá para "Settings"
2. Role até a seção "GitHub Pages"
3. Em "Custom domain", adicione seu domínio
4. Salve as configurações
5. Configure seu provedor de domínio para apontar para os IPs do GitHub Pages

#### Para Vercel:
1. No dashboard da Vercel, selecione seu projeto
2. Vá para "Settings" > "Domains"
3. Adicione seu domínio personalizado
4. Siga as instruções para configurar os registros DNS

## Configuração do EmailJS para Notificações {#configuracao-do-emailjs}

O EmailJS é um serviço que permite enviar emails diretamente do frontend, sem necessidade de backend. No plano gratuito, você pode enviar até 200 emails por mês, o que deve ser suficiente para a maioria dos casamentos.

### Passos para Configuração:

1. **Criar uma Conta no EmailJS**
   - Acesse [emailjs.com](https://www.emailjs.com/)
   - Clique em "Sign Up" e crie uma conta gratuita

2. **Adicionar um Serviço de Email**
   - No dashboard, clique em "Email Services"
   - Clique em "Add New Service"
   - Escolha seu provedor de email (Gmail, Outlook, etc.)
   - Siga as instruções para conectar sua conta de email

3. **Criar um Template de Email**
   - No dashboard, vá para "Email Templates"
   - Clique em "Create New Template"
   - Crie um template para as notificações de RSVP, exemplo:
     ```
     Assunto: Nova confirmação de presença: {{nome}}
     
     Olá Thiago e Juliana,
     
     Vocês receberam uma nova confirmação para o casamento:
     
     Nome: {{nome}}
     Email: {{email}}
     Telefone: {{telefone}}
     Confirmação: {{confirmacao}}
     Acompanhantes: {{acompanhantes}}
     Observações: {{observacoes}}
     
     Data da confirmação: {{data}}
     ```

4. **Integrar o EmailJS no Site**
   - Abra o arquivo `index.html`
   - Adicione o script do EmailJS antes do fechamento da tag `</body>`:
     ```html
     <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>
     ```
   
   - Abra o arquivo `app.js`
   - Procure a função `initRSVPForm()`
   - Substitua o código do envio do formulário pelo seguinte:
     ```javascript
     // Inicializar EmailJS
     // SUBSTITUA 'YOUR_PUBLIC_KEY' pela sua chave pública do EmailJS
     emailjs.init('YOUR_PUBLIC_KEY');
     
     // No evento de envio do formulário
     form.addEventListener('submit', function(event) {
       event.preventDefault();
       
       // Mostrar indicador de carregamento
       submitBtn.disabled = true;
       submitBtn.textContent = 'Enviando...';
       
       // SUBSTITUA os IDs abaixo pelos seus IDs do EmailJS
       emailjs.sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', form)
         .then(function() {
           form.reset();
           formSuccess.style.display = 'block';
           submitBtn.disabled = false;
           submitBtn.textContent = 'Confirmar Presença';
         }, function(error) {
           console.error('Erro ao enviar:', error);
           formError.style.display = 'block';
           submitBtn.disabled = false;
           submitBtn.textContent = 'Confirmar Presença';
         });
     });
     ```

5. **Obter as Chaves e IDs Necessários**
   - No dashboard do EmailJS:
     - Sua chave pública está em "Account" > "API Keys"
     - O ID do serviço está em "Email Services" (ex: 'service_abc123')
     - O ID do template está em "Email Templates" (ex: 'template_xyz789')
   - Substitua esses valores no código acima

## Personalização do Site {#personalizacao-do-site}

O site foi desenvolvido para ser facilmente personalizável:

### Imagens e Fotos:
- Substitua as imagens placeholder criando uma pasta `images` e atualizando os caminhos no arquivo `style.css`
- Para adicionar suas próprias fotos, procure por:
  ```css
  .hero {
    background-image: url('SUA_IMAGEM_AQUI');
  }
  ```

### Informações do Casamento:
- No arquivo `index.html`, atualize:
  - Local do casamento
  - Horário
  - Informações adicionais
  - Texto "Sobre o Casal"
  - Informações importantes

### Cores e Estilo:
- No arquivo `style.css`, localize a seção `:root` para modificar as cores principais:
  ```css
  :root {
    --color-primary: #SEU_COR_AQUI;
    /* outras cores */
  }
  ```

## Manutenção do Site {#manutencao-do-site}

### Cronograma Recomendado:
- **3-6 meses antes do casamento**: Lance o site
- **2-3 meses antes**: Envie convites com o link
- **1 mês antes**: Acompanhe as confirmações
- **2 semanas antes**: Envie lembretes para quem não confirmou
- **Após o casamento**: Atualize o site com agradecimentos e fotos

### Backup:
- Mantenha uma cópia local de todos os arquivos do site
- Se estiver usando GitHub, seu código já está em backup

### Suporte:
- Se encontrar problemas com o EmailJS, consulte a [documentação oficial](https://www.emailjs.com/docs/)
- Para problemas com a hospedagem, consulte o suporte da plataforma escolhida

---

Esperamos que estas instruções ajudem a colocar seu site RSVP online rapidamente! Se precisar de ajuda adicional, não hesite em contratar um desenvolvedor web para ajustes personalizados.

**Parabéns pelo casamento e boa sorte com os preparativos!**