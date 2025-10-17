Language Translation Bot (Lex, Lambda, Translate)

This project demonstrates the creation of a fully functional serverless chatbot using Amazon Lex to automatically translate user input into a target language. The solution highlights complex integration between Natural Language Processing (NLP) and specialized AWS AI services.

 Architecture and Flow

The bot operates on a crucial Code Hook architecture, where the Lex NLP engine temporarily delegates fulfillment to a custom Lambda function.

Architecture Diagram:
![Architecture Diagram](diagram.png)

 AWS Services Utilized

    Amazon Lex V2: Manages the user conversation, recognizes the translation Intent, and extracts the Text and Language slots.

    AWS Lambda: Serves as the Code Hook. It processes the input slots, calls Amazon Translate, and formats the final response back to Lex.

    Amazon Translate: The core AI service that performs the actual language conversion.

    IAM: Manages cross-service permissions (Lambda's access to Translate).

## Key Technical Challenges & Insights

This project required overcoming several non-trivial integration hurdles specific to the Lex V2 environment:

    Slot Definition & NL Processing:

        Challenge: Lex's refusal to register the custom TargetLanguage slot and the general text slot (text) due to strict registration order and deprecated AMAZON slot types.

        Solution: Successfully implemented a workaround by manually defining the TargetLanguage slot type and using the AMAZON.FreeFormInput type, demonstrating persistence in overcoming platform limitations.

    SDK Version Mismatch:

        Challenge: Encountered Runtime.ImportModuleError in Lambda due to incompatibility between the newer Node.js runtimes and the outdated AWS SDK v2 call structure.

        Solution: Resolved by refactoring the Lambda code to use the modular AWS SDK v3 client (@aws-sdk/client-translate), proving the ability to maintain modern serverless environments.

    Fulfillment Logic & Build Errors:

        Challenge: The bot failed to build due to mandatory but unnecessary Fulfillment Updates settings (missing startResponse, timeout values).

        Solution: Systematically identified and provided placeholder values for all mandatory Fulfillment fields required by the Lex V2 builder, ensuring the Intent could be successfully compiled.

## Visual Documentation Checklist


    Lex Intent Screenshot:
![Sample Utterances](sampleutt.png)
![Slots](slots.png)

    Lambda Code Hook Integration:

![Fullfillment](fullfillment.png)

    Working Proof :

  ![Test](Test.png)
