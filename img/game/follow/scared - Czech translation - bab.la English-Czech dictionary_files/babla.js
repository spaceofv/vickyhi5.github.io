$('.site-switch-toggle a').on('click touchstart', function( event ){
  event.preventDefault();
  $('body').toggleClass('site-switch-open');
});
$(document).click(function(event) {
  if(!$(event.target).closest('.site-switch-toggle a').length && !$(event.target).is('.site-switch-toggle a')) {
    $('body').removeClass('site-switch-open');
  };
});
$('.dropdown').on('mouseover', function( event ){
  $('body').removeClass('site-switch-open');
});

// smooth scrolling for anchor links on page
$('a.scroll-link').on('click', function( event ){
  event.preventDefault();
  $('html,body').animate({scrollTop:$(this.hash).offset().top}, 400);
});

// display scroll up link
$(window).scroll(function() {
  var height = $(window).scrollTop();
  if(height >= 200 ) {
    $('.back-to-top').fadeIn();
  }
  if(height < 200 ) {
    $('.back-to-top').fadeOut();
  }
});

// fix sidebar ad on scrolling (via jquery-scrolltofixed)
$(document).ready(function() {
  $(this).scrollTop(0);
  if ($(window).height() > 639) { $('#fixed').scrollToFixed({ minWidth: 975, zIndex: 900 });}
});

function babSearch(){
  window.location.href=$("#babSearchUrl").val()+$("#bablasearch").val();
}
function babInitSearchField(fieldId, searchType) {
// enable search field functions and language select dropdown (action-links)
  $(fieldId).focus();$(fieldId).select();
  if($(fieldId).val()=='') {
    $('.action-panel-form-clear').css('display', 'none');
  };
  $(fieldId).on('keyup', function(e){
    var code=e.which;
    if (code==13)e.preventDefault();
    if (code==13){
      window.location.href=$("#babSearchUrl").val()+$(this).val();
    }
    if ($(this).val().length > ('0') ) {
      $('.action-panel-form-clear').css('display', 'block');
    } else {
      $('.action-panel-form-clear').css('display', 'none');
    }
  });
  $('.action-panel-form-clear').on('click touchstart', function( event ){
    event.preventDefault();
    $(fieldId).val('');
    $(this).css('display', 'none');
    $(fieldId).focus();
    $('body').removeClass('action-links-open');
  });
  $('.action-links-toggle').on('click', function( event ){
    event.preventDefault();
    $('body').toggleClass('action-links-open');
    $('html, body').animate({scrollTop:0}, '1');
  });
  $(fieldId).on('click touchstart', function( event ){
    $('body').removeClass('action-links-open');
  });
  $('.action-panel-form-keyboard').on('click touchstart', function( event ){
    $('body').removeClass('action-links-open');
  });

  if (searchType=='d') {
    var babSuggestions = new Bloodhound({
      datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
      queryTokenizer: Bloodhound.tokenizers.whitespace,
      remote: {
        url: '/ax/dictionary/ta',
        prepare: function (query, settings) {
            settings.type = "POST";
            settings.data = {q: query, d: $('#babDict').val()}; // you can pass some data if you need to
            return settings;
        },
        rateLimitWait: 200
      }
    });

    $('#prefetch .typeahead').bind('typeahead:select', function(ev, data, dataset) {
      window.location.href=data.url;
    });
    $('#prefetch .typeahead').typeahead({
        hint: false,
        highlight: true,
        minLength: 2
      }, {
        name: 'babSuggestions',
        source: babSuggestions,
        display: 'value',
        limit: 10,
        templates: {
          suggestion: function(data) {
           return '<div onclick=window.location.href="' +data.url+ '"><span class="flag ' + data.language + '"></span> ' + data.value + '</div>';
          }
        }
    });
  } else if (searchType=='c') {
    var babSuggestions = new Bloodhound({
      datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
      queryTokenizer: Bloodhound.tokenizers.whitespace,
      remote: {
        url: '/ax/conjugation/getVerbs',
        prepare: function (query, settings) {
            settings.type = "POST";
            settings.data = {v: $('#prefetch .typeahead').val(), l: $('input[name="currentConjLang"]').val()}; // you can pass some data if you need to
            return settings;
        },
        rateLimitWait: 50
      }
    });

    $('#prefetch .typeahead').typeahead({
        hint: false,
        highlight: true,
        minLength: 2
      }, {
        name: 'babSuggestions',
        source: babSuggestions,
        display: 'value',
        templates: {
          suggestion: function(data) {
           return '<div onclick=\'window.location.href="' + $('#babSearchUrl').val() + data.url + '"\'><span class="' + $('#bab-currentConjLang').attr('class') + '"></span> ' + data.value + '</div>';
          }
        }
    });
  }
}

// load social icons for footer (css ref added after loading for performance)
function loadCSS(href, before, media){ "use strict";
  var ss = window.document.createElement( "link" );
  var ref = before || window.document.getElementsByTagName( "script" )[ 0 ];
  ss.rel = "stylesheet"; ss.href = href; ss.media = "only x";
  ref.parentNode.insertBefore( ss, ref ); setTimeout( function(){ ss.media = media || "all"; } );
}

function babRepeatIt() {
  $("#babSound").load();
}

function babSpeakIt(lang, id, word) {
  var url = '/sound/'+lang+'/'+id+'.mp3';
  if (!$("#babSound").length) {
    var ae=document.createElement("AUDIO");
    ae.src = url;
    ae.autoplay = true;
    ae.id = "babSound";
    document.body.appendChild(ae);
  } else {
    $("#babSound").attr("src",url);
    $("#babSound").load();
  }
  $('body').addClass('sound-layer-in');
  $('a.sound-layer-off').on('click touchstart', function(event){
    event.preventDefault();
    $('body').removeClass('sound-layer-in');
  });
  $('#wordSpoken').html(word);
  ga('send','pageview', url);
  babShowSound();
}

function babStripTagsWL(str, allowedTags) {
 // The whitelist variable contains all the allowed tags to be used into our forms.
 var whitelist = "<b>,<br>,<i>,<li>,<ol>,<p>,<span>,<u>,<ul><strong>";
 // Making sure the allow arguments are strings containing only tags in lowercase (<a><b><c>).
 // If an array came as allowed Tags let's convert it to string ((allowed || "") + "") to match it against the regex rule given.
 var aUserTags = (((allowedTags || "") + "").toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []);
 // Variable to save the user's allowed tags after the comparison with the whitelist.
 var aFinalUserTags = [];
 // This regular expression represents the format of the tags.
 var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi;
 // This is a regular expression for searching: HTML comment tags, PHP tags, Javascript tags and javascript keywords within some html attributes.
 var languageTags = /<!--[\s\S]*?-->|<(?:\?|\%)(?:php|=)?[\s\S]*?(?:\?|\%)>|<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
 // Regex to check if there is an URL within the html tags or attributes that contain some URL.
 var urlRegex =/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])|(\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;

 //Let's verify if the user's allowed tags exist in our whitelist. If not, we should strip the not allowed tag.
 if (aUserTags.length > 0) {
  for (i = 0; i < aUserTags.length; i++) {
   if (whitelist.search(aUserTags[i]) > -1) {
    aFinalUserTags[i] = aUserTags[i];
   }
  }
  // Let's remove empty items from aFinalUserTags.
  for (i = 0; i < aFinalUserTags.length; i++) {
   if (typeof aFinalUserTags[i] === "undefined") {
    aFinalUserTags.splice(i, 1);
    i--;
   }
  }
 }
 // This variable contains the string with the final user's allowed tags saved in aFinalUserTags.
 var finalUserTags = aFinalUserTags.join();
 // Let's replace the language tags for an empty string and validate the allowed tags.
 // In the second replace function while is a valid tag format, let's search for the tag into the finalUserTags.
 //$0 is the allowed tag. Ex. <a>. $1 it's the tag name without the openning tags. ex. a
 var cleanText = str.replace(languageTags, '').replace(tags, function ($0, $1) {
 // Form input validation. If there is an input with image type, we should strip it!
 if ($1.toLowerCase() === 'input') {
  $0 = ($0.toLowerCase().search(/(type\s*=\s*[\"\']image[\"\']\s*)/i) > -1) ? '' : $0;
 }
 // Infected Keywords and detecting untrust URL validation.
 if ($0.search('javascript') > -1 || $0.search('alert') > -1 || $0.search('window') > -1
     || $0.search('location') > -1 || $0.search('cookie') > -1 || $0.search(urlRegex) > -1) {
     var infectedString = $0;
     $0 = $0.replace($0, '<'+$1+'>');
 }
 // If we find the position of the element $1 into the whitelist, let's return the allowed tag. If not we have to remove the tag.
 return finalUserTags.search('<'+$1.toLowerCase()+'>') > -1 ? $0 : '';
 });
 // At this point let's check if there is a url within the html attributes.
 return cleanText;
}
