// mascaras.js
// Máscaras específicas para os campos de cartão (número, validade e CVV)

document.addEventListener("DOMContentLoaded", () => {
  const numeroCartao = document.getElementById("numeroCartao");
  const validade = document.getElementById("validade");
  const cvv = document.getElementById("cvv");

  // Máscara do número do cartão (formato: 1234 5678 9012 3456)
  if (numeroCartao) {
    numeroCartao.addEventListener("input", (e) => {
      let v = e.target.value.replace(/\D/g, "");
      v = v.substring(0, 16); // limita a 16 dígitos
      v = v.replace(/(\d{4})(?=\d)/g, "$1 ");
      e.target.value = v.trim();
    });
  }

  // Máscara da validade (formato: MM/AA)
  if (validade) {
    validade.addEventListener("input", (e) => {
      let v = e.target.value.replace(/\D/g, "");
      v = v.substring(0, 4); // limita a 4 dígitos
      if (v.length >= 3) {
        v = v.replace(/(\d{2})(\d{1,2})/, "$1/$2");
      }
      // impede mês maior que 12
      const [mes] = v.split("/");
      if (mes && parseInt(mes) > 12) v = "12" + (v.includes("/") ? v.substring(2) : "");
      e.target.value = v;
    });
  }

  // Máscara do CVV (3 ou 4 dígitos)
  if (cvv) {
    cvv.addEventListener("input", (e) => {
      let v = e.target.value.replace(/\D/g, "");
      e.target.value = v.substring(0, 4);
    });
  }
});
