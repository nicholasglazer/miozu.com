<script>
  import {onMount} from 'svelte';

  let {words = [], className = '', speed = 100, deleteSpeed = 50, pauseDuration = 2000} = $props();

  let displayText = $state('');
  let currentWordIndex = $state(0);
  let isDeleting = $state(false);
  let charIndex = $state(0);

  onMount(() => {
    let timeout;

    const type = () => {
      const currentWord = words[currentWordIndex];

      if (!isDeleting) {
        // Typing forward
        if (charIndex < currentWord.length) {
          displayText = currentWord.substring(0, charIndex + 1);
          charIndex++;
          timeout = setTimeout(type, speed);
        } else {
          // Pause before deleting
          timeout = setTimeout(() => {
            isDeleting = true;
            type();
          }, pauseDuration);
        }
      } else {
        // Deleting backward
        if (charIndex > 0) {
          displayText = currentWord.substring(0, charIndex - 1);
          charIndex--;
          timeout = setTimeout(type, deleteSpeed);
        } else {
          // Move to next word
          isDeleting = false;
          currentWordIndex = (currentWordIndex + 1) % words.length;
          timeout = setTimeout(type, speed);
        }
      }
    };

    if (words.length > 0) {
      type();
    }

    return () => clearTimeout(timeout);
  });
</script>

<span class="typewriter {className}">
  <span class="typewriter-text">{displayText || '\u00A0'}</span>
  <span class="cursor" class:typing={!isDeleting}>|</span>
</span>

<style>
  .typewriter {
    display: inline-flex;
    align-items: center;
    position: relative;
    min-width: 1ch;
  }

  .typewriter-text {
    font-weight: inherit;
    background: linear-gradient(135deg, #e98c46 0%, #f4a661 50%, #e98c46 100%);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: shimmer 3s linear infinite;
    min-height: 1em;
    display: inline-block;
  }

  .cursor {
    display: inline-block;
    margin-left: 2px;
    color: #e98c46;
    opacity: 0;
    animation: blink 1s infinite;
  }

  .cursor.typing {
    opacity: 1;
    animation: none;
  }

  @keyframes blink {
    0%,
    49% {
      opacity: 1;
    }
    50%,
    100% {
      opacity: 0;
    }
  }

  @keyframes shimmer {
    0% {
      background-position: 0% center;
    }
    100% {
      background-position: 200% center;
    }
  }
</style>
