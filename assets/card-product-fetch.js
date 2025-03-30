
document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('change', onCardSwatchChange);
  });
  
  function onCardSwatchChange(event) {
    if (!event.target.classList.contains('card-swatch')) return;
    const productHandle = event.target.dataset.productHandle;
    if (!productHandle) return;
    const card = event.target.closest('.card-wrapper.product-card-wrapper');
    if (!card) return;
    const variantId = event.target.dataset.variantId;
    if (!variantId) return;
    const sectionId = 'card-product-section';
    const url = `/products/${productHandle}?variant=${variantId}&section_id=${sectionId}`;
    
    fetch(url)
      .then((res) => res.text())
      .then((responseText) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(responseText, 'text/html');
        const newCardEl = doc.querySelector(`#card-product-${card.dataset.productId}`);
        if (newCardEl) card.replaceWith(newCardEl);
      })
      .catch(() => {});
  }
  
  function buildCardFetchUrl(productHandle, optionValues, sectionId) {
    const base = `/products/${productHandle}`;
    const params = new URLSearchParams();
    params.set('section_id', sectionId);
    if (optionValues.length > 0) {
      params.set('option_values', optionValues.join(','));
    }
    return `${base}?${params.toString()}`;
  }
  
  function getCardOptionValues(card) {
   
    const fieldsets = card.querySelectorAll('.product-form__input--swatch');
    let chosen = [];
    fieldsets.forEach((fieldset) => {
      const checked = fieldset.querySelector('input[type="radio"]:checked');
      if (checked) {
        const pos = parseInt(checked.dataset.optionPosition, 10);
        const val = checked.dataset.swatchValue;
        
        
        chosen[pos - 1] = val;
      }
    });
    return chosen.filter((val) => val !== undefined);
  }
