# 🧠 RCA Hub — Plataforma para Análise de Causa Raiz e Comunicação Técnica Eficiente

> Transformando a forma como as equipes industriais registram, analisam e comunicam falhas.

---

## 🚀 Sobre o Projeto

O **RCA Hub** é uma aplicação web que padroniza e simplifica o processo de **Análise de Causa Raiz (RCA)** em ambientes **industriais e de manutenção**.

Ele foi criado para **organizar, acelerar e comunicar de forma visual e estruturada** todas as etapas da investigação de falhas, desde a descrição do problema até as ações corretivas e preventivas — tudo isso consolidado em uma **única página (OnePage PDF)** clara, visual e pronta para compartilhar.

---

## 💡 Problemas que o RCA Hub Resolve

Muitas equipes ainda utilizam planilhas ou relatórios extensos e pouco padronizados para investigar falhas.  
Isso causa diversos desafios:

- ❌ Falta de padronização nas análises  
- ❌ Dificuldade em visualizar causas e correlações  
- ❌ Falta de histórico consolidado de falhas recorrentes  
- ❌ Comunicação ineficiente entre manutenção, engenharia e produção  

O **RCA Hub** foi criado para resolver essas dores com:

✅ Um **formulário guiado e padronizado**  
✅ Um **diagrama de Ishikawa interativo**  
✅ Um **gerador automático de relatórios OnePage PDF**  
✅ Um **guia interativo de preenchimento** dentro da própria aplicação

---

## 🧩 Funcionalidades Principais

### 🧾 Formulário guiado
- Registro de **investigador, processo, equipamento, data e OS**  
- Campos para **descrição do problema**, **por que não foi detectado antes** e **ações que agravaram o desvio**

### ⚡ Ações Corretivas e Futuras
- Cadastro de **ações imediatas** e **ações futuras** com:
  - Descrição
  - Responsável
  - Prazo
  - Status (pendente ou concluída)
- Acompanhamento visual no **OnePage**

### 🧠 Causas & 5 Porquês
- Inserção de múltiplas **hipóteses de causas**
- Aplicação direta da metodologia dos **5 porquês**

### 🐟 Diagrama de Ishikawa (Espinha de Peixe)
- Fatores classificados em **Método**, **Máquina**, **Mão de Obra**, **Material**, **Medida** e **Meio Ambiente**
- Destaque visual dos itens que **contribuíram** para a falha
- Separação no OnePage entre **itens contribuintes** e **avaliados (não contribuintes)**

### 📄 OnePage Automático (PDF)
- Geração de **uma única lâmina A4 (paisagem)** contendo:
  - Cabeçalho de identificação  
  - Descrição & Ações imediatas  
  - Diagrama Ishikawa interativo  
  - Hipóteses & 5 Porquês  
  - Ações Futuras  
  - Observações e Categorias destacadas  
- Exportação em PDF com **html2canvas + jsPDF**

### 💾 Salvamento Local
- Armazenamento automático no **LocalStorage**  
- Botões **Salvar** e **Limpar** para controle manual

### 📚 Guia Interativo de Preenchimento
- A primeira seção do RCA Hub traz um **guia recolhível**, explicando cada etapa e boas práticas
- Expande/fecha ao clique e lembra o estado (aberto/fechado)

---

## 🧭 Fluxo do Processo RCA no Sistema

1️⃣ **Identificação** — quem está investigando, onde e quando ocorreu  
2️⃣ **Descrição** — o que aconteceu, por que não foi percebido antes e se alguma ação agravou  
3️⃣ **Ações Imediatas** — o que foi feito logo após a falha  
4️⃣ **Causas & 5 Porquês** — investigação estruturada e metodológica  
5️⃣ **Espinha de Peixe (Ishikawa)** — categorização dos fatores e contribuições  
6️⃣ **Ações Futuras** — plano de ação com responsáveis e prazos  
7️⃣ **OnePage PDF** — consolidação visual para comunicação e histórico

---

## 💬 Importância do OnePage

O **OnePage** transforma uma análise técnica densa em **comunicação visual e objetiva**.  
Ele é a ponte entre **engenharia, manutenção e gestão** — garantindo que o aprendizado da falha seja compartilhado e lembrado.

**Benefícios diretos:**
- 🧾 Comunicação clara em reuniões e auditorias  
- 📚 Registro histórico de falhas e causas  
- 🔁 Reutilização para prevenir recorrências  
- 🧠 Material de aprendizado e consulta técnica

> 📄 *"Uma falha não documentada é uma falha perdida."*  
> O RCA Hub transforma cada evento em um aprendizado registrado.

---

## 🏭 Benefícios para a Indústria

| Área | Benefício |
|------|------------|
| **Manutenção** | Padroniza relatórios, reduz retrabalho e melhora a rastreabilidade |
| **Engenharia** | Facilita a análise de causas e correlação entre falhas |
| **Produção** | Garante comunicação clara das ocorrências |
| **Gestão** | Gera indicadores consistentes e relatórios rápidos |
| **Auditorias & Qualidade** | Disponibiliza documentação completa e visual de cada falha |

---

## ⚙️ Tecnologias Utilizadas

- **HTML5 / CSS3 / JavaScript (Vanilla JS)**
- **html2canvas** — captura e renderização da página para imagem  
- **jsPDF** — geração e exportação do PDF OnePage  
- **LocalStorage API** — persistência local dos dados  
- Interface responsiva e leve com design **SaaS moderno**

---

## 🧩 Estrutura Simplificada

📁 rca_analise_app/

├── index.html # Interface principal e estrutura das seções

├── styles.css # Estilos visuais (modo claro, UI moderna)

├── script.js # Lógica do RCA Hub e geração do OnePage

└── assets/ # (opcional) ícones, logotipos e imagens

## 📸 Preview do Projeto

<img width="1846" height="917" alt="image" src="https://github.com/user-attachments/assets/092b3249-287b-467c-ba98-438f8076bafc" />
<img width="1848" height="920" alt="image" src="https://github.com/user-attachments/assets/d72d7f5b-cf10-4948-b1cf-c1eb341bf1c9" />
<img width="1316" height="927" alt="image" src="https://github.com/user-attachments/assets/2a27b1d9-847c-4b25-972a-158ef441b8c0" />

---

## 💡 Como Usar

1. Abra o arquivo `index.html` em um navegador moderno (Chrome, Edge, Firefox).  
2. Preencha as seções conforme sua análise.  
3. Clique em **Salvar** para armazenar localmente.  
4. Clique em **Exportar OnePage (PDF)** para gerar o relatório visual completo.

---

## 📚 Próximos Passos

- 🔄 Integração com APIs de sistemas de manutenção (SAP PM, CMMS etc.)  
- 👥 Controle multiusuário e histórico centralizado  
- 📈 Dashboard de indicadores de falhas e reincidência  
- 🧠 Machine Learning para sugerir causas recorrentes

---

## 🧱 Contribuições

Contribuições são bem-vindas!  
Envie PRs com correções, melhorias de UX, traduções ou novas features.  
Para ideias e sugestões, abra uma *issue* aqui no repositório. 🙌

---

## 📞 Contato

**Desenvolvido por:** [Lucas Nogueira Delegredo]  
💼 [LinkedIn]([https://linkedin.com/in/seu-perfil](https://www.linkedin.com/in/lucasdelegredo/))  
📧 [lucasdelegredo@gmail.com]  

---

## 📜 Licença

Este projeto é distribuído sob a licença **MIT** — sinta-se à vontade para usar e adaptar.

---

### 🧠 RCA Hub — “Transformando falhas em aprendizado técnico e melhoria contínua.”
