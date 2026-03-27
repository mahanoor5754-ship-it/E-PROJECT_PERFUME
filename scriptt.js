$(document).ready(function() {
    // Navbar background change on scroll
    $(window).scroll(function() {
        if ($(this).scrollTop() > 50) {
            $('.navbar').addClass('scrolled shadow-sm');
        } else {
            $('.navbar').removeClass('scrolled shadow-sm');
        }
    });

    // Smooth subtle parallax effect for the large background text
   $(window).on('scroll', function() {
    var scroll = $(window).scrollTop();
    $('.hero-title').css({
        // Yahan se -50% hata diya, sirf vertical movement rakhi hai
        'transform': 'translateY(' + (scroll * 0.1) + 'px)' 
    });
});
});

$(document).ready(function(){
    $(".hero-title").fadeIn(3000); // 2000ms = 2 seconds
});

$(document).ready(function(){
    $(".navbar").fadeIn(3000); // 2000ms = 2 seconds
});

$(document).ready(function(){
    $("#button").fadeIn(3000); // 2000ms = 2 seconds
});

$(document).ready(function(){
    $(".hero-subtitle ").fadeIn(3000); // 2000ms = 2 seconds
});


// signin

$(document).ready(function() {
    $('#signInBtn').on('click', function() {
        // Show golden message with a slide effect
        $('#loginMsg').slideDown();

         
      
        setTimeout(function(){
            $('#exampleModal').modal('hide');
            $('#loginMsg').hide();
        }, 3000);
      
    });

    // Reset message when modal is closed
    $('#exampleModal').on('hidden.bs.modal', function () {
        $('#loginMsg').hide();
    });
});



$(document).ready(function() {
    $('#signInBtn').on('click', function() {
        let email = $('#email').val().trim();
        let password = $('#password').val().trim();
        let isValid = true;

        // Reset previous states
        $('.dark-input').removeClass('is-invalid');
        $('.error-text').hide();
        $('#loginMsg').hide();

        // Email Validation
        if (email === "" || !email.includes('@')) {
            $('#email').addClass('is-invalid');
            $('#emailError').fadeIn();
            isValid = false;
        }

        // Password Validation (at least 6 characters)
        if (password.length < 6) {
            $('#password').addClass('is-invalid');
            $('#passError').fadeIn();
            isValid = false;
        }

        // Final Check
        if (isValid) {
            $(this).html('<i class="fas fa-spinner fa-spin"></i> Processing...'); // Spinner effect
            $(this).prop('disabled', true); // Disable button to prevent double clicks

            setTimeout(function() {
                $('#loginMsg').fadeIn();
                $('#signInBtn').html('Sign In').prop('disabled', false);
                
                // Modal ko band karne ke liye (Optional)
                
            }, 1500);
        }


        


    });

    // Inputs par click karne se error hat jaye
    $('.dark-input').on('input', function() {
        $(this).removeClass('is-invalid');
        $(this).next('.error-text').fadeOut();
    });
});



          






// Checkout Modal

$(document).ready(function() {
    // 1. Load Cart from LocalStorage (Refresh hone par data save rahega)
    let cart = JSON.parse(localStorage.getItem('user_cart')) || [];

    // Initial update on page load (Badge aur list dikhane ke liye)
    updateCartLayout();

    // Helper Function: Cart ko browser memory mein save karne ke liye
    function saveCartToStorage() {
        localStorage.setItem('user_cart', JSON.stringify(cart));
    }

    // 2. Buy Now Click Event
   // 2. Buy Now Click Event (Updated for Modal & Card)
    $(document).on('click', '.buy-now', function(e) {
        e.preventDefault();
        
        let itemName = $(this).attr('data-name'); 
        let itemPrice = $(this).attr('data-price');
        let itemImg = "";

        // Check karein ke click card par hua hai ya modal mein
        if ($(this).closest('.modal').length > 0) {
            // Agar click Modal ke andar hua hai
            itemImg = $(this).closest('.modal').find('.carousel-item.active img').attr('src');
        } else {
            // Agar click Card par hua hai
            let bgImg = $(this).closest('.col-6, .col-md-3').find('.img-front').css('background-image');
            itemImg = bgImg ? bgImg.replace('url(','').replace(')','').replace(/\"/gi, "") : "";
        }

        if (itemName && itemPrice) {
            cart.push({ 
                name: itemName, 
                price: parseFloat(itemPrice),
                img: itemImg
            });
            
            saveCartToStorage();
            updateCartLayout();
            
            // Button Feedback
            let btn = $(this);
            let originalText = btn.text();
            btn.text("Added!").css("border-color", "#d4af37");
            setTimeout(() => btn.text(originalText).css("border-color", "#333"), 800);
        }
    });

    // 3. Remove Item from Cart
    $(document).on('click', '.remove-item', function() {
        let index = $(this).data('index');
        cart.splice(index, 1);
        
        saveCartToStorage(); // Save updated cart
        updateCartLayout();
        renderCheckoutSummary(); 
    });

    // 4. Update UI (Badge, List, Total)
    function updateCartLayout() {
        let html = '';
        let total = 0;
        $('#cart-count').text(cart.length); // Update Badge count

        if (cart.length === 0) {
            html = '<p class="text-center text-muted py-3">Your cart is empty.</p>';
        } else {
            cart.forEach((item, index) => {
                html += `
                <div class="d-flex justify-content-between align-items-center py-3 border-bottom border-secondary">
                    <div class="d-flex align-items-center">
                        <img src="${item.img}" style="width:50px; height:50px; object-fit:cover; border-radius:5px; margin-right:12px; border: 1px solid #333;">
                        <div>
                            <span class="text-white d-block" style="font-size:14px;">${item.name}</span>
                            <span style="color: #d4af37; font-size: 13px;">$${item.price.toFixed(2)}</span>
                        </div>
                    </div>
                    <button class="btn btn-sm remove-item" data-index="${index}" style="color: #ff4d4d;">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>`;
                total += item.price;
            });
        }
        $('#cart-items-list').html(html);
        $('#total-price').text(total.toFixed(2));
    }

    // 5. Render Checkout Summary
    function renderCheckoutSummary() {
        let html = '';
        let total = 0;

        if (cart.length === 0) {
            html = '<p class="text-center text-muted">No items to checkout.</p>';
        } else {
            cart.forEach(item => {
                html += `
                <div class="d-flex align-items-center mb-4">
                    <img src="${item.img}" style="width:70px; height:70px; border-radius:8px; object-fit:cover; border: 1px solid #d4af37;">
                    <div class="flex-grow-1 ms-3">
                        <div class="fw-bold text-white" style="letter-spacing: 1px; font-size: 15px;">${item.name.toUpperCase()}</div>
                        <div style="color: #d4af37; font-size: 14px;">$${item.price.toFixed(2)}</div>
                    </div>
                </div>`;
                total += item.price;
            });
        }
        $('#checkout-items-list').html(html);
        $('#checkout-total-price').text(total.toFixed(2));
    }

    // 6. Global Window Functions
    window.openCheckoutModal = function() {
        if(cart.length === 0) {
            alert("Your cart is empty!");
            return;
        }
        renderCheckoutSummary();
        $('#mymodal').modal('hide'); 
        $('#checkoutModal').modal('show'); 
    }

    window.placeOrder = function() {
        $('#order-success').css('display', 'flex').hide().fadeIn(500);
        cart = []; 
        saveCartToStorage(); // Clear localStorage on order
        updateCartLayout();
    };

    // --- Validation & Steps Logic ---
    function validateStep1() {
        let isValid = true;
        $('.error-msg').remove(); 
        $('.premium-input').removeClass('is-invalid');

        if ($('#fname').val().trim() === "") {
            $('#fname').addClass('is-invalid').after('<span class="error-msg">Required</span>');
            isValid = false;
        }
        if ($('#cemail').val().trim() === "" || !$('#cemail').val().includes('@')) {
            $('#cemail').addClass('is-invalid').after('<span class="error-msg">Invalid Email</span>');
            isValid = false;
        }
        if ($('#caddress').val().trim() === "") {
            $('#caddress').addClass('is-invalid').after('<span class="error-msg">Address Required</span>');
            isValid = false;
        }
        return isValid;
    }

    window.nextStep = function(step) {
        if (step === 2 && !validateStep1()) return; 

        $('.checkout-step').addClass('d-none');
        $(`#step-${step}`).removeClass('d-none');
        $('.step-item').removeClass('active');
        $(`#step-${step}-label`).addClass('active');
    };
});















// wishlist
// wishlist logic with LocalStorage
$(document).ready(function() {
    // 1. Load Wishlist from LocalStorage on Page Load
    let savedWishlist = localStorage.getItem('userWishlist');
    let wishlist = savedWishlist ? JSON.parse(savedWishlist) : [];

    // Pehli baar UI load karne ke liye
    updateAllUI();

    // 2. Wishlist Button Toggle (Card par click)
    $(document).on('click', '.heart-btn', function(e) {
        e.preventDefault();
        let name = $(this).attr('data-name');
        let index = wishlist.indexOf(name);

        if (index === -1) {
            wishlist.push(name);
            $(this).addClass('active').css('color', '#ff0000');
        } else {
            wishlist.splice(index, 1);
            $(this).removeClass('active').css('color', '');
        }
        
        saveAndRefresh(); // Save to LocalStorage
    });

    // 3. Modal ke andar se Remove button click
    $(document).on('click', '.remove-wish', function() {
        let name = $(this).attr('data-name');
        
        wishlist = wishlist.filter(item => item !== name);

        // Card wale button ko wapis normal karne ke liye
        $(`.heart-btn[data-name="${name}"]`).removeClass('active').css('color', '');

        saveAndRefresh(); // Save to LocalStorage
    });

    // 4. Save to LocalStorage and Update UI
    function saveAndRefresh() {
        localStorage.setItem('userWishlist', JSON.stringify(wishlist));
        updateAllUI();
    }

    // 5. UI Update Function
    function updateAllUI() {
        // Badge Update
        $('#wishlist-count').text(wishlist.length);

        // Card buttons ko highlight karne ke liye (jab page refresh ho)
        $('.heart-btn').each(function() {
            let btnName = $(this).attr('data-name');
            if (wishlist.includes(btnName)) {
                $(this).addClass('active').css('color', '#ff0000');
            } else {
                $(this).removeClass('active').css('color', '');
            }
        });

        let html = '';
        if (wishlist.length === 0) {
            html = '<p class="text-center text-muted py-3">Wishlist is empty</p>';
        } else {
            wishlist.forEach((item) => {
                html += `
                <div class="d-flex justify-content-between align-items-center py-2 border-bottom border-secondary">
                    <span class="text-white">${item}</span>
                    <button class="btn btn-sm text-danger remove-wish" data-name="${item}">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </div>`;
            });
        }
        $('#wishlist-items-list').html(html);
    }
});

// Social Proof Popup js


const notifications = [
    { name: "Anam from Karachi", product: "N°5 Chanel", time: "2 mins ago" },
    { name: "Zain from Lahore", product: "Bleu de chanel", time: "5 mins ago" },
    { name: "Sara from Islamabad", product: "Miss Dior", time: "just now" },
    { name: "Hamza from Dubai", product: "sauvage", time: "10 mins ago"},
    { name: "Sadia from multan", product: "Ck Be", time: "8 mins ago"},
    { name: "Sofia from Qatar", product: "Bombshell", time: "3 mins ago"},
    { name: "Jackson from USA", product: "Gucci Guilty", time: "6 mins ago"},
    { name: "Liam from Uk", product: "Chanel Chance", time: "7 mins ago"},
];

const popup = document.getElementById('sales-notification');
const msg = document.getElementById('popup-msg');
const time = document.getElementById('popup-time');

function showNotification() {
    // Random data pick karein
    const randomIdx = Math.floor(Math.random() * notifications.length);
    const data = notifications[randomIdx];

    // Data set karein
    msg.innerHTML = `<strong>${data.name}</strong> just bought <strong>${data.product}</strong>`;
    time.innerText = data.time;

    // Show popup
    popup.classList.remove('hidden');

    // 5 seconds baad hide kar dein
    setTimeout(() => {
        popup.classList.add('hidden');
    }, 5000);
}

// Har 12 seconds baad naya notification dikhayein
setInterval(showNotification, 12000);

// Pehla notification 3 seconds baad aaye ga
setTimeout(showNotification, 3000);


// sweetalert footer

function handleJoin() {
    const emailInput = document.getElementById('newsletter-email');
    
    if (emailInput.value.trim() !== "") {
        Swal.fire({
            title: 'Welcome to Scentora!',
            text: 'You have successfully joined our exclusive newsletter.',
            icon: 'success',
            background: '#111', // Black background
            color: '#D4AF37',   // Gold text
            confirmButtonColor: '#D4AF37',
            confirmButtonText: 'Great!'
        });
        emailInput.value = "";
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Please enter your email first.',
            background: '#111',
            color: '#fff',
            confirmButtonColor: '#D4AF37'
        });
    }
}


// counter js

const counters = document.querySelectorAll('.counter-value');
const speed = 200; // Animation speed

const startCounters = () => {
    counters.forEach(counter => {
        const updateCount = () => {
            const target = +counter.getAttribute('data-target');
            const count = +counter.innerText;
            const inc = target / speed;

            if (count < target) {
                counter.innerText = Math.ceil(count + inc);
                setTimeout(updateCount, 15);
            } else {
                counter.innerText = target + "+"; // Aakhir mein '+' sign add karne ke liye
            }
        };
        updateCount();
    });
};

// Intersection Observer taake animation sirf tab ho jab screen par aaye
const observer = new IntersectionObserver((entries) => {
    if(entries[0].isIntersecting) {
        startCounters();
        observer.disconnect(); // Ek baar chalne ke baad band ho jaye
    }
}, { threshold: 0.5 });

observer.observe(document.querySelector('.counter-section'));

// Aosanimation

AOS.init({
    duration: 1000, // Animation ki speed (1 second)
    once: true,     // Sirf aik baar animate ho jab user scroll kare
  });


  // tilt aboutimg

$('.tilt-img').on('mousemove', function(e) {
    const $this = $(this);
    const width = $this.outerWidth();
    const height = $this.outerHeight();
    const offset = $this.offset();
    
    const mouseX = e.pageX - offset.left;
    const mouseY = e.pageY - offset.top;
    
    // Tilt calculation (20 degree max)
    const xRotation = 20 * ((mouseY - height / 2) / height);
    const yRotation = -20 * ((mouseX - width / 2) / width);
    
    // Scale badhane se glow aur clear nazar aata hai
    const transform = `perspective(1000px) rotateX(${xRotation}deg) rotateY(${yRotation}deg) scale3d(1.08, 1.08, 1.08)`;
    
    $this.css('transform', transform);
});

// Reset when mouse leaves
$('.tilt-img').on('mouseleave', function() {
    $(this).css({
        'transform': 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)'
    });
});



// mahrmodaljs




$(document).ready(function() {
    // Plus button 
    $(document).on('click', '.plus-btn', function() {
        // 'this' us card ka button hai jise click kiya gaya hai
        var $input = $(this).closest('.qty-selector').find('.qty-input');
        var val = parseInt($input.val());
        $input.val(val + 1);
    });

    // Minus button
    $(document).on('click', '.minus-btn', function() {
        var $input = $(this).closest('.qty-selector').find('.qty-input');
        var val = parseInt($input.val());
        if (val > 1) {
            $input.val(val - 1);
        }
    });
});

// <!-- value incre decre -->

  const upperMinInput = document.getElementById("value-min");
const upperMaxInput = document.getElementById("value-max");
   const minInput = document.querySelector(".min-price");
const maxInput = document.querySelector(".max-price");
const minText = document.getElementById("min-val");
const maxText = document.getElementById("max-val");

function updateSlider() {
    
    if (parseInt(minInput.value) >= parseInt(maxInput.value)) {
        minInput.value = maxInput.value - 100;
    }
    minText.textContent = parseInt(minInput.value).toLocaleString();
    maxText.textContent = parseInt(maxInput.value).toLocaleString();
    upperMinInput.value = "Rs. " + parseInt(minInput.value).toLocaleString() + ".00";
    upperMaxInput.value = "Rs. " + parseInt(maxInput.value).toLocaleString() + ".00";
}

minInput.addEventListener("input", updateSlider);
maxInput.addEventListener("input", updateSlider)





//price list

// download-word.js

function openPriceList(fileName) {
    // Ye line aapke 'assets' folder se woh file uthaye gi jo button par click hui hai
    window.open('assets/' + fileName, '_blank');
}
