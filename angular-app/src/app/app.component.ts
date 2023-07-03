import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DomSanitizer, SafeHtml, SafeResourceUrl } from '@angular/platform-browser';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{

  form: FormGroup;
  title = 'Avanade - Accenture OpenAI Hackethon';
  imageDataFromUrl: string = '';

  public textToAnalyze: string = "This is a test";
  public responseText: string ="";
  public imageUrl: string = "";
  
  public inputTextForPicture: string = "";
  public inputTextToBeTranslated: string = "";
  public targetLanguage?: string = "German";
  public targetVoiceTone: string = "Warehouse Manager";

  public targetWritingStyle: string = "Creative";
  public targetFormatOption: string = "Concise";

  public targetLanguages: string[] = [  'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Russian', 'Chinese', 'Japanese', 'Korean', 'Arabic', 'Dutch', 'Polish', 'Romanian', 'Turkish', 'Ukrainian', 'Bulgarian', 'Czech', 'Danish', 'Greek', 'Finnish', 'Hindi', 'Hungarian', 'Indonesian', 'Norwegian', 'Slovak', 'Swedish', 'Thai', 'Vietnamese'];
  public targetFormatOptions: string[] = ["Concise", "Corporate Jargon", "Detailed"];
  public targetVoiceToneOptions: string[] = ["Warehouse Manager", "Procurement Manager"];
  public targetWritingStyleOptions: string[] = ["Creative", "Instructive", "Persuasive", "Narrative", "Descriptive", "Analytical"];
  
  filteredTargetLanguages: string[] = [];
  filteredTargetFormatOptions: string[] = [];
  filteredTargetVoiceToneOptions: string[] = [];
  filteredTargetWritingStyleOptions: string[] = [];
  public iframeUrl: SafeResourceUrl;

  constructor(private http: HttpClient, private fb: FormBuilder ,private sanitizer: DomSanitizer) {

    this.iframeUrl = this.sanitizer.bypassSecurityTrustResourceUrl('/assets/myFile.html');
      
    this.form = this.fb.group({
    
    });

      }

      openTab = 1;
  toggleTabs($tabNumber: number){
    this.openTab = $tabNumber;
  }

    public imageGenFromUrl(imageUrl: string) {
      console.log(imageUrl);
        this.http.get(imageUrl, { responseType: 'blob' })
        .subscribe(blob => {
          const reader = new FileReader();
          reader.onloadend = () => {
            this.imageDataFromUrl = reader.result as string;
            console.log(reader.result);
      
          };
          if (blob) {
            reader.readAsDataURL(blob);
          }
        });
      }

  ngOnInit() {
    
    
  }
  

  public invokeRequestToOpenAI() {
    
    this.http.post('/api/openaiproxy', { Prompt: this.getBasePrompt() }, { responseType: 'text' }).subscribe(
      data => { console.log(data); this.responseText = data; },
      error => { console.error('Error:', error); }
    );
  
  }

  public imageLoading: boolean=false;

  public invokeRequestToOpenAIImage() {
    this.imageLoading = true;
    this.http.post('/api/getimage', { Prompt: this.inputTextForPicture }, { responseType: 'text' }).subscribe(
      data => { this.imageLoading= false; console.log(data);this.imageGenFromUrl(data); },
      error => { this.imageLoading = false; console.error('Error:', error); }
    );
  }

  capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

getConceptDescription(concept: string): string {
  // Return the description based on the concept
  switch (concept) {
    case 'Language Style':
      return 'Adjustments in formality, sentence structure, and word choice.';
    case 'Terminology':
      return 'Use of preferred or commonly used terms in the target language or legal system.';
    // add all other cases...
    default:
      return '';
  }
}


filterItems(targetArrayPropertyName: string, event: any) {
  let filtered : string[] = [];
  let query = event.query;
  var currentComponentInstance = this as any;

  var targetArray= currentComponentInstance[targetArrayPropertyName];

  for(let i = 0; i < targetArray.length; i++) {
    let targetArrayItem = targetArray[i];
    if (targetArrayItem.toLowerCase().indexOf(query.toLowerCase()) == 0) {
      filtered.push(targetArrayItem);
    }
  }

  // Update the property on the component directly
  currentComponentInstance["filtered" + this.capitalizeFirstLetter(targetArrayPropertyName)] = filtered;
}

getBasePrompt(): string {
  return `Rule:

  You are a natural language text translator and localizer, and your primary goal is to help users map fields from Source to Target schema. Please use your intelligence to translate and localize the text into the Target Language, Voice Tone, Writing Style, and format provided.
  
  Context:
  
  Create a translated and localized text using the input text with high confidence. Please make sure to use the provided Target Language, Voice Tone, Writing Style, and format to translate and localize the text.
  
  Instructions:
  
      Translate the input text into the Target Language.
  
      Modify the translated text using the Target Voice Tone.
  
      Adjust the text according to the Target Writing Style.
  
      Finally, apply the Target Format to the text.
  
      Goal:
  
      Please use your intelligence to translate and localize the input provided below under Input. The Target Language, Voice Tone, Writing Style, and Format are also provided. Please use the input text and translate/localize it to the Target Language, Voice Tone, Writing Style, and Format.
  
                Please return only the translated and localized text in response. Please please please Do not add any extra heading or title before the response, just return the response.
  
      Input:
  
                --------------------------------------------------
  
                               ${this.inputTextToBeTranslated}
  
                --------------------------------------------------
  
      Target Language: ${this.targetLanguage}
  
      Target Voice Tone suited for a : ${this.targetVoiceTone}
  
      Target Writing Style: ${this.targetWritingStyle}
  
      Target Format: ${this.targetFormatOption}
  
      The goal is to generate a translated and localizd text with high confidence that is in the Target Language, Voice Tone, Writing Style, and Format.`;
}

public htmlContent= `<!DOCTYPE html>
<html>
<head>
    <style>
        .concept[data-concept="Cultural Context"] {
            background-color: #FFFF00;
        }
        .concept[data-concept="Legal Practices"] {
            background-color: #FFA500;
        }
        .concept[data-concept="Language Style"] {
            background-color: #00FF00;
        }
        .concept[data-concept="Terminology"] {
            background-color: #ADD8E6;
        }
        .concept[data-concept="Formatting and Structure"] {
            background-color: #FFB6C1;
        }
        .concept[data-concept="Legal References and Citations"] {
            background-color: #D8BFD8;
        }
    </style>
</head>
<body>
    <p>
        Roche in Rotkreuz, <span class="concept" data-concept="Terminology">der größte private Arbeitgeber</span> im Kanton Zug, feiert im Jahr 2019 sein 50-jähriges Jubiläum. Das Motto der Feierlichkeiten lautet <span class="concept" data-concept="Cultural Context">#StayCurious</span>. Denn es ist die <span class="concept" data-concept="Cultural Context">Neugier</span>, die das Unternehmen seit seiner Gründung im Jahr 1969 als zentralen Treiber der Innovationskraft begleitet hat: Von der Vorgängerfirma Tegimenta in Zug mit anfänglich rund 60 Mitarbeitern bis zum heutigen Roche Diagnostics International in Rotkreuz mit rund 2500 Mitarbeitern aus über 70 Nationen. Unzählige begeisterte und engagierte Menschen haben Rotkreuz in den vergangenen Jahrzehnten mit viel Ausdauer, Hingabe und Innovationsgeist geprägt - als Mitarbeiter, Lieferanten, Behörden und Geschäftspartner. 50 von ihnen stellen sich in unserer digitalen Gedenkpublikation "#StayCurious 50 Jahre - 50 Menschen" vor.
    </p>
    <p>
        Der Standort entwickelte sich zu einem modernen, offenen Campus, der auch architektonisch einzigartig und in der Zentralschweiz unvergleichlich ist. Heute ist Rotkreuz ein wichtiger Standort für das <span class="concept" data-concept="Terminology">Diagnostikgeschäft</span> und vereint alle zentralen Funktionen und Geschäftsbereiche. Das Unternehmen bildet derzeit 131 Lehrlinge aus.
    </p>
    <p>
        "<span class="concept" data-concept="Language Style">Unser Standort in Rotkreuz verbindet eine lokal verwurzelte Kultur mit einer sehr internationalen Ausrichtung</span>", erklärt Annette Luther, General Manager Roche Diagnostics International Ltd. "In den vergangenen Jahrzehnten wurde der Campus von engagierten Menschen geprägt, die große Ausdauer, Engagement und Innovationsgeist gezeigt haben - ob als Mitarbeiter, Lieferanten, Behörden oder Geschäftspartner. Wir möchten ihnen dafür danken."
    </p>
    <p>
        Annette Luther. Auch in Zukunft wird Rotkreuz als wichtiger globaler <span class="concept" data-concept="Terminology">Diagnostik-Hub</span> das digitale Potenzial für eine bessere Gesundheitsversorgung weiter ausschöpfen: mit integrierten Lösungen für Patienten, Ärzte und Labore. Dabei optimieren datengetriebene Prozesse Arbeitsabläufe in Laboren und unterstützen die Entscheidungsfindung der Ärzte, um bessere Behandlungen für Patienten zu bieten.
    </p>
    <p>
        Severin Schwan. Severin Schwan, CEO von Roche, würdigte die Entwicklung zum wichtigsten Diagnostikstandort in der Schweiz: "Die Diagnostik wird weiterhin an Bedeutung gewinnen zum Wohl der Patienten. In der Zukunft werden wir nicht nur Geräte und Tests anbieten, sondern zunehmend auch digitale Entscheidungsfindungshilfen. Diese werden dazu beitragen, Behandlungen gezielter und effizienter einzusetzen. Die Digitalisierung wird die personalisierte Medizin enorm beschleunigen und Rotkreuz wird sicherlich an vorderster Front dabei sein."
    </p>
</body>
</html>`;


}