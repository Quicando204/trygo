/* ==========================================================
   TRYGO — dados do site
   Para adicionar um produto: copiar o bloco de "extra-fino",
   mudar o id e as imagens (colocar os ficheiros em assets/images/).
   Campos com null aparecem como "A preencher" no site.
   ========================================================== */
window.TRYGO = {
  categories: ['Clássicos', 'Ultra', 'Sensibilidade', 'Outros'],

  products: [
    {
      id: 'extra-fino',
      name: 'TRYGO Extra Fino',
      nameEn: 'Extra Thin',
      category: 'Ultra',
      type: 'Preservativos especiais',
      short: 'Preservativos especiais extra finos, em embalagem de 3 unidades.',
      features: [
        'Extra fino (Extra Thin)',
        'Preservativos especiais (Special Condoms)',
        'Embalagem com 3 unidades'
      ],
      material: null,        // A preencher com a informação oficial
      lubrication: null,     // A preencher com a informação oficial
      dimensions: null,      // A preencher com a informação oficial
      quantity: '3 unidades',
      images: [
        {
          src: 'assets/images/trygo-extra-fino-sachet.jpg',
          alt: 'Mão a retirar um preservativo da embalagem individual TRYGO Extra Fino',
          fit: 'cover'
        },
        {
          src: 'assets/images/trygo-extra-fino-caixa.jpg',
          alt: 'Caixa TRYGO Extra Fino, preservativos especiais, 3 unidades',
          fit: 'contain'
        }
      ],
      about: [
        'O TRYGO Extra Fino faz parte da linha de preservativos especiais da marca. Como indica a embalagem, é um produto extra fino (Extra Thin), apresentado em caixa com 3 unidades.',
        'Para o material, a lubrificação e as dimensões, consulte a informação impressa na embalagem. Esta ficha será completada com os dados oficiais assim que forem fornecidos pela TRYGO.'
      ]
    }
  ]
};
